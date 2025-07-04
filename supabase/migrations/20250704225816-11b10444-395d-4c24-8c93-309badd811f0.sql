-- Update the auto_verify_buyers function to include security definer with proper search_path
CREATE OR REPLACE FUNCTION public.auto_verify_buyers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Auto-verify buyers (owners) upon registration
  IF NEW.user_type = 'owner' THEN
    NEW.is_verified = true;
    NEW.verified_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$;