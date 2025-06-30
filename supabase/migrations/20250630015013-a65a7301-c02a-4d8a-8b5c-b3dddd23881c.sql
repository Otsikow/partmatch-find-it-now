
-- First, let's check the current RLS policies and fix them
-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "authenticated_users_can_insert_own_parts" ON public.car_parts;
DROP POLICY IF EXISTS "everyone_can_view_available_parts" ON public.car_parts;
DROP POLICY IF EXISTS "users_can_view_own_parts" ON public.car_parts;
DROP POLICY IF EXISTS "users_can_update_own_parts" ON public.car_parts;
DROP POLICY IF EXISTS "users_can_delete_own_parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can create their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Everyone can view available parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can view their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can update their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can delete their own parts" ON public.car_parts;

-- Ensure RLS is enabled
ALTER TABLE public.car_parts ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies for authenticated users
CREATE POLICY "Allow authenticated users to insert car parts"
ON public.car_parts
FOR INSERT
TO authenticated
WITH CHECK (supplier_id = auth.uid());

-- Allow everyone to view available parts (public marketplace)
CREATE POLICY "Allow everyone to view available parts"
ON public.car_parts
FOR SELECT
TO authenticated, anon
USING (status = 'available');

-- Allow users to view their own parts regardless of status
CREATE POLICY "Allow users to view own parts"
ON public.car_parts
FOR SELECT
TO authenticated
USING (supplier_id = auth.uid());

-- Allow users to update their own parts
CREATE POLICY "Allow users to update own parts"
ON public.car_parts
FOR UPDATE
TO authenticated
USING (supplier_id = auth.uid());

-- Allow users to delete their own parts
CREATE POLICY "Allow users to delete own parts"
ON public.car_parts
FOR DELETE
TO authenticated
USING (supplier_id = auth.uid());
