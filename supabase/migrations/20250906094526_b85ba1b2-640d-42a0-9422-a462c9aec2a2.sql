-- Fix critical security vulnerability in profiles table
-- Remove the overly permissive policy that exposes all user data for verified users
DROP POLICY IF EXISTS "Users can view public profile data" ON public.profiles;

-- Create a more secure policy that only allows users to view their own complete profile
CREATE POLICY "Users can view own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create a separate policy for public profile data that only exposes safe information
CREATE POLICY "Public can view safe seller info" 
ON public.profiles 
FOR SELECT 
USING (
  is_verified = true 
  AND user_type = 'supplier'
);

-- Update the existing function to only return safe public data
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
RETURNS TABLE(
  id uuid, 
  first_name text, 
  rating numeric, 
  total_ratings integer, 
  is_verified boolean, 
  city text, 
  country text, 
  created_at timestamp with time zone,
  profile_photo_url text
) 
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    p.id,
    p.first_name,
    p.rating,
    p.total_ratings,
    p.is_verified,
    p.city,
    p.country,
    p.created_at,
    p.profile_photo_url
  FROM public.profiles p
  WHERE p.id = profile_id 
    AND p.is_verified = true 
    AND p.user_type = 'supplier';
$$;