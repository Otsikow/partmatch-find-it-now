
-- Create reviews table for buyer-to-seller ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, seller_id) -- Prevent duplicate reviews from same buyer to same seller
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Users can view all reviews" 
  ON public.reviews 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for sellers" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" 
  ON public.reviews 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- Update the existing update_user_rating function to work with the new reviews table
CREATE OR REPLACE FUNCTION public.update_user_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.profiles
  SET 
    rating = (
      SELECT AVG(rating::DECIMAL)
      FROM public.reviews
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger to update ratings when reviews are inserted, updated, or deleted
DROP TRIGGER IF EXISTS trigger_update_user_rating ON public.reviews;
CREATE TRIGGER trigger_update_user_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_user_rating();
