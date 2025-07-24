-- Fix the car-part-images storage policies
-- Drop existing policies that are incomplete
DROP POLICY IF EXISTS "Users can upload car part images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload car part images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to car part images" ON storage.objects;

-- Create new comprehensive policies for car-part-images bucket
CREATE POLICY "Authenticated users can upload to car-part-images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Ensure public read access to car part images (for displaying)
CREATE POLICY "Public read access to car-part-images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'car-part-images');

-- Allow users to update their own car part images
CREATE POLICY "Users can update own car-part-images" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own car part images  
CREATE POLICY "Users can delete own car-part-images" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );