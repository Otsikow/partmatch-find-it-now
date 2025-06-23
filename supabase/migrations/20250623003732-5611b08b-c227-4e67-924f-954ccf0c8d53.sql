
-- Create table to store AI review results
CREATE TABLE public.ai_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.part_requests(id) NOT NULL,
  review_status TEXT NOT NULL CHECK (review_status IN ('approved', 'rejected', 'needs_human_review')),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  ai_reasoning TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ai_reviews table
ALTER TABLE public.ai_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to AI reviews
CREATE POLICY "Admins can manage AI reviews" 
  ON public.ai_reviews 
  FOR ALL 
  USING (true);

-- Add storage bucket for part photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('part-photos', 'part-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for part photos
CREATE POLICY "Anyone can view part photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'part-photos');

CREATE POLICY "Authenticated users can upload part photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'part-photos' AND auth.role() = 'authenticated');
