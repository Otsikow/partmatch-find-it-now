-- Fix security issue: Set proper search_path for handle_new_user function
-- This prevents potential security vulnerabilities in SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    location,
    user_type
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'user_type'
  );
  return new;
end;
$function$;