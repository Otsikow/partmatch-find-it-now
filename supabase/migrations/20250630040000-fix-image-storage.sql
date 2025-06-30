
-- Fix storage policies for car part images to ensure proper access

-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload car part images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view car part images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their car part images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their car part images" ON storage.objects;

-- Create new comprehensive policies
CREATE POLICY "Authenticated users can upload car part images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow public read access to all car part images
CREATE POLICY "Public read access to car part images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'car-part-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own car part images" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own images  
CREATE POLICY "Users can delete their own car part images" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.role() = 'authenticated'
  );
