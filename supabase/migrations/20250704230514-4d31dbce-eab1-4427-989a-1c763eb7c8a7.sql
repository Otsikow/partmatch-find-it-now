CREATE OR REPLACE FUNCTION public.is_authorized_admin_email(email_to_check text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    authorized_emails TEXT[] := ARRAY[
        'admin@partmatch.com',
        'administrator@partmatch.com',
        'j777wmb@gmail.com'
    ];
BEGIN
    RETURN email_to_check = ANY(authorized_emails);
END;
$function$;