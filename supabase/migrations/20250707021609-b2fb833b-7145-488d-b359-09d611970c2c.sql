-- Fix the profiles table INSERT policy to allow trigger-based inserts
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create a new policy that allows both authenticated users and system triggers
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT 
WITH CHECK (
  -- Allow if user is inserting their own profile
  auth.uid() = id 
  OR 
  -- Allow if this is a system trigger (auth.uid() might be null during user creation)
  auth.uid() IS NULL
);