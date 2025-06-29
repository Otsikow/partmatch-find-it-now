
-- Fix RLS policies for offers table to allow admin updates
DROP POLICY IF EXISTS "Allow authenticated users to view offers" ON public.offers;
DROP POLICY IF EXISTS "Allow suppliers to create offers" ON public.offers;
DROP POLICY IF EXISTS "Allow suppliers to update their offers" ON public.offers;
DROP POLICY IF EXISTS "Allow admins to update offers" ON public.offers;

-- Enable RLS on offers table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view offers
CREATE POLICY "authenticated_users_can_view_offers"
ON public.offers
FOR SELECT
TO authenticated
USING (true);

-- Allow suppliers to create their own offers
CREATE POLICY "suppliers_can_create_offers"
ON public.offers
FOR INSERT
TO authenticated
WITH CHECK (supplier_id = auth.uid());

-- Allow suppliers to update their own offers
CREATE POLICY "suppliers_can_update_own_offers"
ON public.offers
FOR UPDATE
TO authenticated
USING (supplier_id = auth.uid());

-- Allow admins to update any offer (including status changes)
CREATE POLICY "admins_can_update_all_offers"
ON public.offers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'user_type' = 'admin'
  )
);

-- Update part_requests RLS policies for admin access
DROP POLICY IF EXISTS "Allow authenticated users to view requests" ON public.part_requests;
DROP POLICY IF EXISTS "Allow users to create requests" ON public.part_requests;
DROP POLICY IF EXISTS "Allow users to update their requests" ON public.part_requests;
DROP POLICY IF EXISTS "Allow admins to update requests" ON public.part_requests;

-- Enable RLS on part_requests table
ALTER TABLE public.part_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view requests
CREATE POLICY "authenticated_users_can_view_requests"
ON public.part_requests
FOR SELECT
TO authenticated
USING (true);

-- Allow users to create their own requests
CREATE POLICY "users_can_create_requests"
ON public.part_requests
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- Allow users to update their own requests
CREATE POLICY "users_can_update_own_requests"
ON public.part_requests
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

-- Allow admins to update any request (including status changes)
CREATE POLICY "admins_can_update_all_requests"
ON public.part_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'user_type' = 'admin'
  )
);
