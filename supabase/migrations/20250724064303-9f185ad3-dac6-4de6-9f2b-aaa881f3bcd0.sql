-- Create blog-images storage bucket 
feature/featured-badge
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Create policies for blog images
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authors can update their blog images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authors can delete their blog images"
ON storage.objects
FOR DELETE

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true);