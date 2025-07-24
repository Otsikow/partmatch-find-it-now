-- Fix the admin policy for part_requests to use profiles table instead of auth.users
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "admins_can_update_all_requests" ON public.part_requests;

-- Create new policy that uses profiles table
CREATE POLICY "admins_can_update_all_requests" 
ON public.part_requests 
FOR UPDATE 
USING (
  (auth.uid() = owner_id) OR 
  (EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  ))
);

-- Also check and fix similar issue for offers table if it exists
DROP POLICY IF EXISTS "admins_can_update_all_offers" ON public.offers;

CREATE POLICY "admins_can_update_all_offers" 
ON public.offers 
FOR UPDATE 
USING (
  (auth.uid() = supplier_id) OR 
  (EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_type = 'admin'
  ))
);