
-- Add location fields to the car_parts table
ALTER TABLE public.car_parts 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN address TEXT;

-- Update the profiles table to include location fields if not already present
ALTER TABLE public.profiles 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN address TEXT;

-- Create index for location-based queries (optional but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_car_parts_location ON public.car_parts(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(latitude, longitude);
