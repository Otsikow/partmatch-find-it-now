-- Fix the function search path security warning
DROP FUNCTION IF EXISTS public.get_public_profile_data(uuid);

-- Recreate function with explicit search_path setting for security
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
SET search_path = public
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