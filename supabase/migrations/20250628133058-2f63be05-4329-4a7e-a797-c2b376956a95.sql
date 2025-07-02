
-- Create an enum for user types if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('owner', 'supplier', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create audit log table for tracking admin-related activities
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
    ON public.admin_audit_logs 
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Create a security definer function to check if email is authorized for admin role
CREATE OR REPLACE FUNCTION public.is_authorized_admin_email(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    authorized_emails TEXT[] := ARRAY[
        'admin@partmatch.com',
        'administrator@partmatch.com'
    ];
BEGIN
    RETURN email_to_check = ANY(authorized_emails);
END;
$$;

-- Create trigger function to prevent unauthorized admin role assignments
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_admin_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
$$;

-- Create trigger to enforce admin role constraints
DROP TRIGGER IF EXISTS prevent_unauthorized_admin_trigger ON public.profiles;
CREATE TRIGGER prevent_unauthorized_admin_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_unauthorized_admin_assignment();

-- Create function to log admin security events
CREATE OR REPLACE FUNCTION public.log_admin_security_event(
    event_type TEXT,
    event_details JSONB DEFAULT NULL,
    target_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.admin_audit_logs (user_id, action, details)
    VALUES (
        COALESCE(target_user_id, auth.uid()),
        event_type,
        COALESCE(event_details, '{}'::jsonb)
    );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_authorized_admin_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_security_event(TEXT, JSONB, UUID) TO authenticated;
