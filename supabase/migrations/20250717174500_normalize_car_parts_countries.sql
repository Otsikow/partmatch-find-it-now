UPDATE public.car_parts 
SET country = COALESCE(
  (SELECT profiles.country 
   FROM public.profiles 
   WHERE profiles.id = car_parts.supplier_id 
   AND profiles.country IS NOT NULL),
  'GH'
)
WHERE country IS NULL;

COMMENT ON COLUMN public.car_parts.country IS 'Country code for the car part location. Normalized from null values on 2025-01-17.';
