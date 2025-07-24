-- Test the function to see if it works
-- Let's first try to call the function directly to see if there are any obvious issues

-- Check if we can create a user_type value
DO $$
BEGIN
  RAISE NOTICE 'Testing user_type enum: %', 'owner'::user_type;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error with user_type enum: %', SQLERRM;
END
$$;

-- Let's also check if the function definition is valid by trying to recreate it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer set search_path = ''
AS $$
BEGIN
  RAISE NOTICE 'handle_new_user function called for user: %', NEW.id;
  
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
    
    RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to create profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
      RAISE;
  END;
  
  RETURN NEW;
END;
$$;