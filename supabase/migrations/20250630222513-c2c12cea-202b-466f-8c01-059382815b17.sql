
-- Add offer_id column to reviews table to link ratings to specific transactions
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE;

-- Update the unique constraint to prevent duplicate reviews per transaction
DROP INDEX IF EXISTS reviews_reviewer_seller_unique;
ALTER TABLE public.reviews 
DROP CONSTRAINT IF EXISTS reviews_reviewer_id_seller_id_key;

-- Add new unique constraint for one rating per transaction
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_reviewer_offer_unique UNIQUE(reviewer_id, offer_id);

-- Add transaction_verified column to track verified purchases
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS transaction_verified BOOLEAN DEFAULT false;

-- Update existing reviews table policies to include offer-based access
DROP POLICY IF EXISTS "Users can create reviews for sellers" ON public.reviews;
CREATE POLICY "Users can create reviews for completed transactions" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.offers 
      WHERE id = offer_id 
      AND buyer_id = auth.uid() 
      AND transaction_completed = true
    )
  );

-- Create notification table for rating reminders
CREATE TABLE IF NOT EXISTS public.rating_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reminder_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rating_reminders
ALTER TABLE public.rating_reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for rating_reminders
CREATE POLICY "Users can view their own rating reminders" 
  ON public.rating_reminders 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "System can create rating reminders" 
  ON public.rating_reminders 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_offer_id ON public.reviews(offer_id);
CREATE INDEX IF NOT EXISTS idx_rating_reminders_buyer_id ON public.rating_reminders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_rating_reminders_offer_id ON public.rating_reminders(offer_id);
