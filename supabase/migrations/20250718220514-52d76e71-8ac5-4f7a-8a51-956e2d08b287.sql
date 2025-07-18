-- Add tracking columns to car_parts table for analytics
ALTER TABLE public.car_parts 
ADD COLUMN view_count INTEGER DEFAULT 0,
ADD COLUMN click_count INTEGER DEFAULT 0,
ADD COLUMN last_suggested_promotion TIMESTAMP WITH TIME ZONE,
ADD COLUMN promotion_suggestions_count INTEGER DEFAULT 0;

-- Create table to track promotion suggestions and conversions
CREATE TABLE public.promotion_suggestions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.car_parts(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL, -- 'feature', 'boost', 'extra_images'
    suggested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    converted BOOLEAN DEFAULT false,
    converted_at TIMESTAMP WITH TIME ZONE,
    suggestion_criteria JSONB,
    price_suggested NUMERIC,
    currency TEXT DEFAULT 'GHS',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.promotion_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own promotion suggestions"
ON public.promotion_suggestions 
FOR SELECT 
USING (auth.uid() = seller_id);

CREATE POLICY "System can create promotion suggestions"
ON public.promotion_suggestions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own promotion suggestions"
ON public.promotion_suggestions 
FOR UPDATE 
USING (auth.uid() = seller_id);

-- Create table to track listing analytics
CREATE TABLE public.listing_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES public.car_parts(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'view', 'click', 'contact', 'offer'
    user_id UUID REFERENCES public.profiles(id),
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.listing_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Listing owners can view their analytics"
ON public.listing_analytics 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.car_parts 
    WHERE car_parts.id = listing_analytics.listing_id 
    AND car_parts.supplier_id = auth.uid()
));

CREATE POLICY "System can insert analytics"
ON public.listing_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_promotion_suggestions_listing_id ON public.promotion_suggestions(listing_id);
CREATE INDEX idx_promotion_suggestions_seller_id ON public.promotion_suggestions(seller_id);
CREATE INDEX idx_promotion_suggestions_suggested_at ON public.promotion_suggestions(suggested_at DESC);
CREATE INDEX idx_listing_analytics_listing_id ON public.listing_analytics(listing_id);
CREATE INDEX idx_listing_analytics_event_type ON public.listing_analytics(event_type);
CREATE INDEX idx_listing_analytics_created_at ON public.listing_analytics(created_at DESC);