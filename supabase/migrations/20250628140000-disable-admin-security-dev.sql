
-- Temporarily disable strict email authorization for development
-- This allows any email to be used for admin registration during development

CREATE OR REPLACE FUNCTION public.is_authorized_admin_email(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- During development, allow any email to be admin
    -- TODO: Re-enable strict email checking before production
    RETURN TRUE;
END;
$$;

-- Update the trigger function to be less restrictive during development
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_admin_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Only check if user_type is being set to admin
    IF NEW.user_type = 'admin' THEN
        -- Get the user's email from auth.users
        SELECT email INTO user_email 
        FROM auth.users 
        WHERE id = NEW.id;
        
        -- During development, skip email authorization check
        -- TODO: Re-enable email authorization before production
        
        -- Still log the admin role assignment for audit purposes
        INSERT INTO public.admin_audit_logs (user_id, action, details)
        VALUES (
            NEW.id,
            'ADMIN_ROLE_ASSIGNED',
            jsonb_build_object(
                'email', user_email,
                'assigned_by', auth.uid(),
                'timestamp', now(),
                'note', 'Development mode - email restrictions disabled'
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;
