CREATE OR REPLACE FUNCTION public.update_supplier_verification(supplier_id_param uuid, is_verified_param boolean, documents_param text[] DEFAULT NULL::text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles 
  SET 
    is_verified = is_verified_param,
    verification_documents = COALESCE(documents_param, verification_documents),
    verified_at = CASE WHEN is_verified_param THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE id = supplier_id_param;
  
  RETURN FOUND;
END;
$function$;