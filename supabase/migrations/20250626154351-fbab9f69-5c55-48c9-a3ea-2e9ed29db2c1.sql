
-- Create car_parts table for listed parts
CREATE TABLE public.car_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES public.profiles(id) NOT NULL,
  title text NOT NULL,
  description text,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  part_type text NOT NULL,
  condition text NOT NULL CHECK (condition IN ('New', 'Used', 'Refurbished')),
  price numeric NOT NULL CHECK (price > 0),
  currency text NOT NULL DEFAULT 'GHS',
  images text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'hidden', 'pending'))
);

-- Enable RLS
ALTER TABLE public.car_parts ENABLE ROW LEVEL SECURITY;

-- Policy for suppliers to view their own parts
CREATE POLICY "Suppliers can view their own parts" 
  ON public.car_parts 
  FOR SELECT 
  USING (auth.uid() = supplier_id);

-- Policy for suppliers to insert their own parts
CREATE POLICY "Suppliers can create their own parts" 
  ON public.car_parts 
  FOR INSERT 
  WITH CHECK (auth.uid() = supplier_id);

-- Policy for suppliers to update their own parts
CREATE POLICY "Suppliers can update their own parts" 
  ON public.car_parts 
  FOR UPDATE 
  USING (auth.uid() = supplier_id);

-- Policy for suppliers to delete their own parts
CREATE POLICY "Suppliers can delete their own parts" 
  ON public.car_parts 
  FOR DELETE 
  USING (auth.uid() = supplier_id);

-- Policy for everyone to view available parts
CREATE POLICY "Everyone can view available parts" 
  ON public.car_parts 
  FOR SELECT 
  USING (status = 'available');

-- Create storage bucket for car part images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-part-images', 'car-part-images', true);

-- Storage policies for car part images
CREATE POLICY "Users can upload car part images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'car-part-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view car part images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'car-part-images');

CREATE POLICY "Users can update their car part images" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'car-part-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their car part images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'car-part-images' AND auth.uid()::text = (storage.foldername(name))[1]);
