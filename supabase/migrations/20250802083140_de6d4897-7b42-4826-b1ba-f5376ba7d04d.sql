-- Add RLS policy for admins to manage featured status of any listing
CREATE POLICY "Admins can manage featured status"
ON public.car_parts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  )
);