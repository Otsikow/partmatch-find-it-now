-- Enable Row Level Security on car_parts table
-- This will enforce the existing RLS policies on the table

ALTER TABLE public.car_parts ENABLE ROW LEVEL SECURITY;