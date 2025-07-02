
-- Update the authorized admin emails function to include your email
CREATE OR REPLACE FUNCTION public.is_authorized_admin_email(email_to_check text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $$
DECLARE
    authorized_emails TEXT[] := ARRAY[
        'admin@partmatch.com',
        'administrator@partmatch.com',
        'j777wmb@gmail.com'
    ];
BEGIN
    RETURN email_to_check = ANY(authorized_emails);
END;
$$;

-- Update your profile to admin status
UPDATE public.profiles 
SET 
    user_type = 'admin',
    is_verified = true,
    verified_at = NOW(),
    updated_at = NOW()
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'j777wmb@gmail.com'
);

-- Also update the user metadata to include admin role
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{user_type}',
    '"admin"'
)
WHERE email = 'j777wmb@gmail.com';

-- Log this admin role assignment for security tracking
INSERT INTO public.admin_audit_logs (user_id, action, details)
SELECT 
    id,
    'ADMIN_ROLE_ASSIGNED',
    jsonb_build_object(
        'email', 'j777wmb@gmail.com',
        'promoted_by', 'system_admin',
        'timestamp', now(),
        'method', 'manual_promotion'
    )
FROM auth.users 
WHERE email = 'j777wmb@gmail.com';
