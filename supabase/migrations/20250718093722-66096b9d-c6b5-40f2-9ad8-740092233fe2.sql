-- Add unique constraint to prevent duplicate ratings between same user pairs
ALTER TABLE public.ratings 
ADD CONSTRAINT unique_rater_rated_request UNIQUE (rater_id, rated_id, request_id);

-- Add unique constraint to reviews table to prevent duplicate reviews
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_reviewer_seller_offer UNIQUE (reviewer_id, seller_id, offer_id);

-- Create an index for faster review lookups
CREATE INDEX idx_reviews_seller_id ON public.reviews(seller_id);
CREATE INDEX idx_ratings_rated_id ON public.ratings(rated_id);