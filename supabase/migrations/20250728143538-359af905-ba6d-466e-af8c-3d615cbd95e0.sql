-- Update existing parts to have default inventory values
UPDATE public.car_parts 
SET 
  quantity = 1,
  low_stock_threshold = 2,
  last_restocked_at = now()
WHERE quantity IS NULL OR low_stock_threshold IS NULL;