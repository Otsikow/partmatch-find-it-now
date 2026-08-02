-- Keep Google OAuth registration compatible with profiles.user_type NOT NULL.
-- The selected buyer/seller role is finalised by the authenticated callback;
-- existing accounts are never rewritten by this trigger.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    location,
    user_type
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'given_name', '')
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'family_name', '')
    ),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'user_type', ''), 'owner')::public.user_type
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
