-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  slug TEXT NOT NULL UNIQUE,
  featured_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  view_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog posts
feature/featured-badge
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND user_type = 'admin'
));

CREATE POLICY "Authors can view their own blog posts"
ON public.blog_posts
FOR SELECT
USING (auth.uid() = author_id);

CREATE POLICY "Authors can create blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blog posts"
ON public.blog_posts
FOR UPDATE

feat/dashboard-button
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND user_type = 'admin'
));

CREATE POLICY "Authors can view their own blog posts"
ON public.blog_posts
FOR SELECT
USING (auth.uid() = author_id);

CREATE POLICY "Authors can create blog posts"
ON public.blog_posts
FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own blog posts"
ON public.blog_posts
FOR UPDATE

main
USING (auth.uid() = author_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_posts_updated_at();

-- Create index for better performance
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);