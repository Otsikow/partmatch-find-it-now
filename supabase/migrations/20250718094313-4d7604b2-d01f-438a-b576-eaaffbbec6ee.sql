-- Add unique constraint to prevent duplicate ratings between same user pairs
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_rater_rated_request'
    ) THEN
        ALTER TABLE public.ratings 
        ADD CONSTRAINT unique_rater_rated_request UNIQUE (rater_id, rated_id, request_id);
    END IF;
END $$;

-- Add unique constraint to reviews table to prevent duplicate reviews
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_reviewer_seller_offer'
    ) THEN
        ALTER TABLE public.reviews 
        ADD CONSTRAINT unique_reviewer_seller_offer UNIQUE (reviewer_id, seller_id, offer_id);
    END IF;
END $$;