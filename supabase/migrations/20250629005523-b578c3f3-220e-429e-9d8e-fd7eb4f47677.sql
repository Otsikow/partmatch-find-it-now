
-- First, let's see what policies exist and then add only the missing ones
-- Drop and recreate all policies to ensure they're correct

-- Drop existing policies
DROP POLICY IF EXISTS "Suppliers can create their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can view their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can update their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Suppliers can delete their own parts" ON public.car_parts;
DROP POLICY IF EXISTS "Everyone can view available parts" ON public.car_parts;

-- Recreate all necessary policies
CREATE POLICY "Suppliers can create their own parts" 
  ON public.car_parts 
  FOR INSERT 
  WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can view their own parts" 
  ON public.car_parts 
  FOR SELECT 
  USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update their own parts" 
  ON public.car_parts 
  FOR UPDATE 
  USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can delete their own parts" 
  ON public.car_parts 
  FOR DELETE 
  USING (auth.uid() = supplier_id);

CREATE POLICY "Everyone can view available parts" 
  ON public.car_parts 
  FOR SELECT 
  USING (status = 'available');
