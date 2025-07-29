-- Add country field to car_parts table for location-based featured listings
ALTER TABLE public.car_parts 
ADD COLUMN featured_country text;

-- Add index for better performance on country-based queries
CREATE INDEX idx_car_parts_featured_country ON public.car_parts (featured_country);

-- Update existing featured parts to have a default country (Ghana)
UPDATE public.car_parts 
SET featured_country = 'GH' 
WHERE is_featured = true AND featured_country IS NULL;