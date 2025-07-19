-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments', 
  'chat-attachments', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policies for chat attachments
-- Allow authenticated users to view chat attachments
CREATE POLICY "Anyone can view chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-attachments');

-- Allow authenticated users to upload chat attachments
CREATE POLICY "Authenticated users can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own chat attachments
CREATE POLICY "Users can delete their own chat attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);