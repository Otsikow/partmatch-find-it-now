-- Fix search path security warnings for the functions we just created
DROP FUNCTION IF EXISTS public.update_recent_views_updated_at();
DROP FUNCTION IF EXISTS public.add_recent_view(UUID, UUID);

-- Create function to update timestamps with secure search path
CREATE OR REPLACE FUNCTION public.update_recent_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Function to add or update recent view (upsert) with secure search path
CREATE OR REPLACE FUNCTION public.add_recent_view(user_id_param UUID, part_id_param UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.recent_views (user_id, part_id, viewed_at)
  VALUES (user_id_param, part_id_param, now())
  ON CONFLICT (user_id, part_id)
  DO UPDATE SET 
    viewed_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';