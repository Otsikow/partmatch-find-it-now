-- Add quality checking fields to car_parts table
ALTER TABLE public.car_parts 
ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_feedback TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS quality_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create listing_quality_checks table to track quality check history
CREATE TABLE IF NOT EXISTS public.listing_quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.car_parts(id) ON DELETE CASCADE,
  quality_score INTEGER NOT NULL,
  feedback_message TEXT,
  flagged_issues JSONB DEFAULT '[]'::jsonb,
  auto_approved BOOLEAN DEFAULT false,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on listing_quality_checks
ALTER TABLE public.listing_quality_checks ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all quality checks
CREATE POLICY "Admins can view all quality checks" 
ON public.listing_quality_checks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.user_type = 'admin'
));

-- Allow users to view quality checks for their own listings
CREATE POLICY "Users can view quality checks for their listings" 
ON public.listing_quality_checks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.car_parts 
  WHERE car_parts.id = listing_quality_checks.listing_id 
  AND car_parts.supplier_id = auth.uid()
));

-- System can insert quality checks
CREATE POLICY "System can insert quality checks" 
ON public.listing_quality_checks 
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listing_quality_checks_listing_id 
ON public.listing_quality_checks(listing_id);

CREATE INDEX IF NOT EXISTS idx_listing_quality_checks_auto_approved 
ON public.listing_quality_checks(auto_approved);