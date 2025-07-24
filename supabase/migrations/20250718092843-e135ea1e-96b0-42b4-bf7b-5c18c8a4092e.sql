-- Create monetization purchases table to track all purchases
CREATE TABLE public.monetization_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.car_parts(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('feature', 'boost', 'extra_photo', 'business_subscription', 'banner_ad', 'combo', 'urgent', 'highlight', 'verified_badge')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  duration_days INTEGER, -- null for one-time purchases like extra photos
  expires_at TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_reference TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create business subscriptions table
CREATE TABLE public.business_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create pricing configuration table
CREATE TABLE public.monetization_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_type TEXT NOT NULL UNIQUE CHECK (feature_type IN ('feature', 'boost', 'extra_photo', 'business_subscription', 'banner_ad', 'combo', 'urgent', 'highlight', 'verified_badge')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GHS',
  duration_days INTEGER, -- null for one-time purchases
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add monetization columns to car_parts if not already present
ALTER TABLE public.car_parts 
ADD COLUMN IF NOT EXISTS is_urgent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS urgent_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS highlighted_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS has_verified_badge BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verified_badge_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extra_photos_count INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE public.monetization_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monetization_pricing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for monetization_purchases
CREATE POLICY "Users can view own purchases" ON public.monetization_purchases
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create purchases" ON public.monetization_purchases
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all purchases" ON public.monetization_purchases
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- RLS Policies for business_subscriptions
CREATE POLICY "Users can view own subscription" ON public.business_subscriptions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create subscription" ON public.business_subscriptions
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscription" ON public.business_subscriptions
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions" ON public.business_subscriptions
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- RLS Policies for monetization_pricing
CREATE POLICY "Everyone can view pricing" ON public.monetization_pricing
FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage pricing" ON public.monetization_pricing
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- Insert default pricing configuration
INSERT INTO public.monetization_pricing (feature_type, amount, duration_days, description) VALUES
('feature', 20.00, 7, 'Feature listing for 7 days'),
('boost', 10.00, 3, 'Boost listing for 3 days'),
('extra_photo', 5.00, NULL, 'Add one extra photo'),
('business_subscription', 100.00, 30, 'Business subscription for 30 days'),
('banner_ad', 180.00, 7, 'Homepage banner ad for 7 days'),
('combo', 30.00, 7, 'Feature + Boost combo for 7 days'),
('urgent', 4.00, 7, 'Urgent tag for 7 days'),
('highlight', 5.00, 7, 'Highlight listing for 7 days'),
('verified_badge', 15.00, 30, 'Verified badge for 30 days');

-- Create function to expire monetization features
CREATE OR REPLACE FUNCTION public.expire_monetization_features()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Expire featured listings
  UPDATE public.car_parts 
  SET is_featured = false, featured_until = NULL
  WHERE is_featured = true AND featured_until < now();
  
  -- Expire boosted listings
  UPDATE public.car_parts 
  SET boosted_until = NULL
  WHERE boosted_until < now();
  
  -- Expire urgent listings
  UPDATE public.car_parts 
  SET is_urgent = false, urgent_until = NULL
  WHERE is_urgent = true AND urgent_until < now();
  
  -- Expire highlighted listings
  UPDATE public.car_parts 
  SET is_highlighted = false, highlighted_until = NULL
  WHERE is_highlighted = true AND highlighted_until < now();
  
  -- Expire verified badges
  UPDATE public.car_parts 
  SET has_verified_badge = false, verified_badge_until = NULL
  WHERE has_verified_badge = true AND verified_badge_until < now();
  
  -- Expire business subscriptions
  UPDATE public.business_subscriptions 
  SET active = false
  WHERE active = true AND end_date < now();
END;
$$;