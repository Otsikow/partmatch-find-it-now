CREATE OR REPLACE FUNCTION public.prevent_unauthorized_admin_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    user_email TEXT;
BEGIN
    -- Only check if user_type is being set to admin
    IF NEW.user_type = 'admin' THEN
        -- Get the user's email from auth.users
        SELECT email INTO user_email 
        FROM auth.users 
        WHERE id = NEW.id;
        
        -- Check if email is authorized for admin role
        IF NOT public.is_authorized_admin_email(user_email) THEN
            RAISE EXCEPTION 'Email % is not authorized for admin role', user_email;
        END IF;
        
        -- Log the admin role assignment
        INSERT INTO public.admin_audit_logs (user_id, action, details)
        VALUES (
            NEW.id,
            'ADMIN_ROLE_ASSIGNED',
            jsonb_build_object(
                'email', user_email,
                'assigned_by', auth.uid(),
                'timestamp', now()
            )
        );
    END IF;
    
    RETURN NEW;
END;
$function$;