-- Add inventory management fields to car_parts table
ALTER TABLE public.car_parts 
ADD COLUMN quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
ADD COLUMN low_stock_threshold INTEGER DEFAULT 2,
ADD COLUMN last_restocked_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing parts to have default quantity of 1
UPDATE public.car_parts 
SET quantity = 1 
WHERE quantity IS NULL;

-- Make quantity NOT NULL after setting defaults
ALTER TABLE public.car_parts 
ALTER COLUMN quantity SET NOT NULL;