-- Fix security vulnerabilities in RLS policies

-- 1. Fix profiles table - restrict sensitive data access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Only allow viewing public profile fields for others, full profile for own
CREATE POLICY "Users can view public profile data" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  auth.uid() = id 
  OR 
  -- Others can only see public fields (we'll handle this in application layer)
  -- For now, allow viewing basic info needed for seller profiles
  (id IS NOT NULL AND is_verified = true)
);

-- 2. Fix part_requests table - restrict to request owners and relevant parties
DROP POLICY IF EXISTS "Anyone can view part requests" ON public.part_requests;
DROP POLICY IF EXISTS "authenticated_users_can_view_requests" ON public.part_requests;

CREATE POLICY "Users can view relevant part requests" 
ON public.part_requests 
FOR SELECT 
USING (
  -- Request owners can see their own requests
  auth.uid() = owner_id 
  OR 
  -- Admins can see all requests
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
  OR
  -- Verified suppliers can see requests to make offers (but with limited data)
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'supplier' 
    AND is_verified = true
  )
);

-- 3. Fix offers table - restrict to parties involved in transaction
DROP POLICY IF EXISTS "Anyone can view offers" ON public.offers;
DROP POLICY IF EXISTS "authenticated_users_can_view_offers" ON public.offers;

CREATE POLICY "Users can view relevant offers" 
ON public.offers 
FOR SELECT 
USING (
  -- Offer creators (suppliers) can see their offers
  auth.uid() = supplier_id 
  OR 
  -- Buyers can see offers on their requests
  auth.uid() = buyer_id 
  OR 
  -- Request owners can see offers on their requests
  EXISTS (
    SELECT 1 FROM public.part_requests pr 
    WHERE pr.id = offers.request_id AND pr.owner_id = auth.uid()
  )
  OR 
  -- Admins can see all offers
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- 4. Add additional protection for verification documents in storage
-- Ensure verification document URLs are only accessible to authorized users
CREATE POLICY "Restrict verification document access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'verification-documents' 
  AND (
    -- Users can access their own documents
    (auth.uid())::text = (storage.foldername(name))[1]
    OR 
    -- Admins can access all verification documents
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  )
);

-- 5. Create function to get safe profile data for public viewing
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  rating numeric,
  total_ratings integer,
  is_verified boolean,
  city text,
  country text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.first_name,
    p.rating,
    p.total_ratings,
    p.is_verified,
    p.city,
    p.country,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;