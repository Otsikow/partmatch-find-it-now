-- Fix RLS policies for reviews table to ensure public access
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;

-- Create a simple policy that allows everyone to view reviews
CREATE POLICY "Public can view all reviews" 
ON reviews 
FOR SELECT 
USING (true);