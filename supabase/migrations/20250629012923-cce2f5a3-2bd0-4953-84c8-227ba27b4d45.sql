
-- First, let's check if we need to enable RLS (if not already enabled)
ALTER TABLE public.car_parts ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting policies that might exist
DROP POLICY IF EXISTS "Allow sellers to insert car parts" ON public.car_parts;
DROP POLICY IF EXISTS "Allow any authenticated user to insert" ON public.car_parts;
DROP POLICY IF EXISTS "Everyone can view available parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can view their own parts" ON public.car_parts;

-- Create the correct INSERT policy that allows users to insert parts with their own supplier_id
CREATE POLICY "Allow sellers to insert car parts"
ON public.car_parts
FOR INSERT
WITH CHECK (supplier_id = auth.uid());

-- Also ensure we have a SELECT policy so users can see available parts
CREATE POLICY "Everyone can view available parts"
ON public.car_parts
FOR SELECT
USING (status = 'available');

-- And ensure suppliers can view their own parts
CREATE POLICY "Suppliers can view their own parts"
ON public.car_parts
FOR SELECT
USING (supplier_id = auth.uid());
