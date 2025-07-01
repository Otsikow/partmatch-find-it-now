
-- Add subscription columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN subscription_type TEXT,
ADD COLUMN subscription_expiry TIMESTAMP WITH TIME ZONE;

-- Add an index for better performance when querying subscription status
CREATE INDEX idx_profiles_subscription ON public.profiles(subscription_type, subscription_expiry);
