-- Add scheduled publishing functionality to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN scheduled_publish_at TIMESTAMP WITH TIME ZONE;

-- Create function to auto-publish scheduled posts
CREATE OR REPLACE FUNCTION public.auto_publish_scheduled_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts 
  SET 
    published = true,
    published_at = now(),
    updated_at = now()
  WHERE 
    published = false 
    AND scheduled_publish_at IS NOT NULL 
    AND scheduled_publish_at <= now();
END;
$$;

-- Create index for better performance on scheduled posts
CREATE INDEX idx_blog_posts_scheduled ON public.blog_posts(scheduled_publish_at) 
WHERE published = false AND scheduled_publish_at IS NOT NULL;