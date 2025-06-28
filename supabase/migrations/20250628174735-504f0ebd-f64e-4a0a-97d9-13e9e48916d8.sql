
-- Add the missing business_location_photo_url column to seller_verifications table
ALTER TABLE public.seller_verifications 
ADD COLUMN business_location_photo_url TEXT;
