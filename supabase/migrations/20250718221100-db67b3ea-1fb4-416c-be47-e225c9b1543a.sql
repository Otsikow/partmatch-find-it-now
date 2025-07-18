-- Create functions to increment view and click counts
CREATE OR REPLACE FUNCTION public.increment_view_count(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.car_parts 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = listing_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_click_count(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.car_parts 
  SET click_count = COALESCE(click_count, 0) + 1
  WHERE id = listing_id;
END;
$$;