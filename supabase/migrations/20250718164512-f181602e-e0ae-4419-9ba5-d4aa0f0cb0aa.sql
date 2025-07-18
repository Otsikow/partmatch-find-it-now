-- Fix search path security vulnerability for expire_monetization_features function
-- This prevents search path injection attacks by setting an empty search path
ALTER FUNCTION public.expire_monetization_features()
SET search_path = '';

-- Update the function body to use fully qualified schema names
-- Since we're setting search_path to '', all object references must be fully qualified
CREATE OR REPLACE FUNCTION public.expire_monetization_features()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Expire featured listings
  UPDATE public.car_parts 
  SET is_featured = false, featured_until = NULL
  WHERE is_featured = true AND featured_until < now();
  
  -- Expire boosted listings
  UPDATE public.car_parts 
  SET boosted_until = NULL
  WHERE boosted_until < now();
  
  -- Expire urgent listings
  UPDATE public.car_parts 
  SET is_urgent = false, urgent_until = NULL
  WHERE is_urgent = true AND urgent_until < now();
  
  -- Expire highlighted listings
  UPDATE public.car_parts 
  SET is_highlighted = false, highlighted_until = NULL
  WHERE is_highlighted = true AND highlighted_until < now();
  
  -- Expire verified badges
  UPDATE public.car_parts 
  SET has_verified_badge = false, verified_badge_until = NULL
  WHERE has_verified_badge = true AND verified_badge_until < now();
  
  -- Expire business subscriptions
  UPDATE public.business_subscriptions 
  SET active = false
  WHERE active = true AND end_date < now();
END;
$function$;