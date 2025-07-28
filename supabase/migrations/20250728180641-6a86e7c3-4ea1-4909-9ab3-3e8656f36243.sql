-- Create function to clean up orphaned profiles (profiles without corresponding auth users)
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_profiles()
RETURNS TABLE(deleted_profile_id UUID, deleted_email TEXT) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Return deleted profiles info before deletion
  RETURN QUERY
  SELECT p.id, p.email 
  FROM public.profiles p
  LEFT JOIN auth.users u ON p.id = u.id
  WHERE u.id IS NULL;
  
  -- Delete orphaned profiles that don't have corresponding auth users
  DELETE FROM public.profiles p
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = p.id
  );
END;
$$;

-- Create function to check if a profile is orphaned
CREATE OR REPLACE FUNCTION public.is_orphaned_profile(profile_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = profile_id
  );
END;
$$;