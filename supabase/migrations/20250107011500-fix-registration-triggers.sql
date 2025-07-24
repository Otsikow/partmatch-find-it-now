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
        BEGIN
            -- Get the user's email from auth.users with error handling
            SELECT email INTO user_email 
            FROM auth.users 
            WHERE id = NEW.id;
            
            IF user_email IS NULL THEN
                RETURN NEW;
            END IF;
            
            -- Check if email is authorized for admin role (only in production)
            IF NOT public.is_authorized_admin_email(user_email) THEN
                RAISE EXCEPTION 'Email % is not authorized for admin role', user_email;
            END IF;
            
            BEGIN
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
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        EXCEPTION
            WHEN OTHERS THEN
                IF NEW.user_type = 'admin' THEN
                    RAISE;
                END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer set search_path = ''
AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      phone, 
      location,
      user_type,
      country,
      city,
      language,
      currency
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      NEW.raw_user_meta_data->>'phone',
      NEW.raw_user_meta_data->>'location',
      COALESCE(NEW.raw_user_meta_data->>'user_type', 'owner')::user_type,
      NEW.raw_user_meta_data->>'country',
      NEW.raw_user_meta_data->>'city',
      COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
      COALESCE(NEW.raw_user_meta_data->>'currency', 'GHS')
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      RAISE;
  END;
  
  RETURN NEW;
END;
$$;
