-- Create the user_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('owner', 'supplier', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recreate the handle_new_user function with proper error handling
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