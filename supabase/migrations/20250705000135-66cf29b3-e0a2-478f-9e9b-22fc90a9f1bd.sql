CREATE OR REPLACE FUNCTION public.update_user_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    rating = (
      SELECT AVG(rating::DECIMAL)
      FROM public.reviews
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);
  RETURN COALESCE(NEW, OLD);
END;
$function$;