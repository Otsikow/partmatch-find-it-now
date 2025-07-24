-- Fix search path security issue for blog posts update function
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
feature/featured-badge
RETURNS TRIGGER

RETURNS TRIGGER 
main
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;