
-- Remove buyer approval requirements by updating auto-approval for buyers
-- and add transaction completion tracking for ratings

-- Update profiles table to auto-verify buyers upon registration
-- Add a function to auto-verify buyers
CREATE OR REPLACE FUNCTION public.auto_verify_buyers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Auto-verify buyers (owners) upon registration
  IF NEW.user_type = 'owner' THEN
    NEW.is_verified = true;
    NEW.verified_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger to auto-verify buyers
DROP TRIGGER IF EXISTS trigger_auto_verify_buyers ON public.profiles;
CREATE TRIGGER trigger_auto_verify_buyers
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auto_verify_buyers();

-- Add transaction completion tracking to offers table
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS transaction_completed BOOLEAN DEFAULT false;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES auth.users(id);

-- Update existing offers to have buyer_id from related part_requests
UPDATE public.offers 
SET buyer_id = (
  SELECT owner_id 
  FROM public.part_requests 
  WHERE part_requests.id = offers.request_id
)
WHERE buyer_id IS NULL;

-- Add rating prompt tracking to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id);
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS transaction_verified BOOLEAN DEFAULT false;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_offer_id ON public.reviews(offer_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON public.offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_transaction_completed ON public.offers(transaction_completed);

-- Add RLS policies for the new rating system
CREATE POLICY "Buyers can create reviews for completed transactions" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.offers
      WHERE offers.id = reviews.offer_id
      AND offers.buyer_id = auth.uid()
      AND offers.transaction_completed = true
    )
  );

-- Update the existing review policies to work with the new system
DROP POLICY IF EXISTS "Users can create reviews for sellers" ON public.reviews;
CREATE POLICY "Users can create reviews for sellers" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    (
      -- Allow direct seller reviews (existing functionality)
      EXISTS (SELECT 1 FROM public.profiles WHERE id = reviews.seller_id) OR
      -- Allow transaction-based reviews (new functionality)
      EXISTS (
        SELECT 1 FROM public.offers
        WHERE offers.id = reviews.offer_id
        AND offers.buyer_id = auth.uid()
        AND offers.transaction_completed = true
      )
    )
  );
