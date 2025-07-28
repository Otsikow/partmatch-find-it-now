-- Add RLS policy for admins to manage user profiles
CREATE POLICY "Admins can update any user profile" 
ON public.profiles 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
  AND user_type = 'admin'
));