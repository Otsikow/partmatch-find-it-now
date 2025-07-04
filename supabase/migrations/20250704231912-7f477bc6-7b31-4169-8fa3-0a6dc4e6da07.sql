CREATE OR REPLACE FUNCTION public.log_admin_security_event(
    event_type text,
    event_details jsonb DEFAULT NULL::jsonb,
    target_user_id uuid DEFAULT NULL::uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.admin_audit_logs (user_id, action, details)
    VALUES (
        COALESCE(target_user_id, auth.uid()),
        event_type,
        COALESCE(event_details, '{}'::jsonb)
    );
END;
$function$;