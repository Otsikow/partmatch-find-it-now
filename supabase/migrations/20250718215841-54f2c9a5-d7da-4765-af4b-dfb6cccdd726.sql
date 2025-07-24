-- Add notification preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN notification_preferences JSONB DEFAULT '{"request_notifications": true, "email_notifications": true, "in_app_notifications": true}'::jsonb;

-- Create table to track smart match notifications
CREATE TABLE public.smart_match_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES public.part_requests(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL DEFAULT 'smart_match',
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    email_sent BOOLEAN DEFAULT false,
    in_app_sent BOOLEAN DEFAULT false,
    match_criteria JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.smart_match_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own smart match notifications"
ON public.smart_match_notifications 
FOR SELECT 
USING (auth.uid() = seller_id);

CREATE POLICY "System can create smart match notifications"
ON public.smart_match_notifications 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_smart_match_notifications_request_id ON public.smart_match_notifications(request_id);
CREATE INDEX idx_smart_match_notifications_seller_id ON public.smart_match_notifications(seller_id);
CREATE INDEX idx_smart_match_notifications_sent_at ON public.smart_match_notifications(sent_at DESC);