
-- First, let's ensure we have proper RLS policies for public viewing of available car parts
-- Check if the policy already exists, if not create it

-- Allow everyone to view available car parts (this policy might already exist from the migration)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'car_parts' 
        AND policyname = 'Everyone can view available parts'
    ) THEN
        CREATE POLICY "Everyone can view available parts" 
        ON public.car_parts 
        FOR SELECT 
        USING (status = 'available');
    END IF;
END $$;

-- Also ensure we can view parts regardless of status for debugging purposes
-- You can remove this policy later if you only want to show available parts
CREATE POLICY "Public can view all parts for debugging" 
ON public.car_parts 
FOR SELECT 
TO anon, authenticated
USING (true);
