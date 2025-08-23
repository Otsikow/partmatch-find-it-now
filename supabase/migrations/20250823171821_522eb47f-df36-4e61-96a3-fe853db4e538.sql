-- Add missing UPDATE policy for verification documents
CREATE POLICY "Users can update their verification documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'verification-documents' AND (auth.uid())::text = (storage.foldername(name))[1]);