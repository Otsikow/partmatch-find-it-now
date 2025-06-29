
-- Ensure the car-part-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-part-images', 'car-part-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create comprehensive storage policies for car part images
DROP POLICY IF EXISTS "Users can upload car part images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view car part images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their car part images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their car part images" ON storage.objects;

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload car part images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'car-part-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND auth.role() = 'authenticated'
  );

-- Allow anyone to view car part images (for public access)
CREATE POLICY "Anyone can view car part images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'car-part-images');

-- Allow users to update their own car part images
CREATE POLICY "Users can update their car part images" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND auth.role() = 'authenticated'
  );

-- Allow users to delete their own car part images
CREATE POLICY "Users can delete their car part images" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'car-part-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND auth.role() = 'authenticated'
  );
