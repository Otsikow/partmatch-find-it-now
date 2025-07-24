-- Add multi-country support fields to profiles table
ALTER TABLE public.profiles ADD COLUMN country TEXT;
ALTER TABLE public.profiles ADD COLUMN city TEXT;
ALTER TABLE public.profiles ADD COLUMN language TEXT DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN currency TEXT DEFAULT 'GHS';

-- Add multi-country support fields to car_parts table  
ALTER TABLE public.car_parts ADD COLUMN country TEXT;
ALTER TABLE public.car_parts ADD COLUMN city TEXT;

-- Add multi-country support fields to part_requests table
ALTER TABLE public.part_requests ADD COLUMN country TEXT;
ALTER TABLE public.part_requests ADD COLUMN currency TEXT DEFAULT 'GHS';

-- Create index for better performance on country-based queries
CREATE INDEX idx_profiles_country ON public.profiles(country);
CREATE INDEX idx_car_parts_country ON public.car_parts(country);
CREATE INDEX idx_part_requests_country ON public.part_requests(country);