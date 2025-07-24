-- Update RLS policies to allow direct seller ratings (without offer_id)

-- Drop the restrictive policy that only allows transaction-based reviews
DROP POLICY IF EXISTS "Buyers can create reviews for completed transactions" ON public.reviews;

-- Create a more flexible policy that allows both direct seller ratings and transaction-based ratings
CREATE POLICY "Users can create seller reviews" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    (
      -- Allow direct seller reviews (offer_id is null)
      offer_id IS NULL OR
      -- Allow transaction-based reviews (offer_id exists and transaction completed)
      EXISTS (
        SELECT 1 FROM public.offers
        WHERE offers.id = reviews.offer_id
        AND offers.buyer_id = auth.uid()
        AND offers.transaction_completed = true
      )
    )
  );