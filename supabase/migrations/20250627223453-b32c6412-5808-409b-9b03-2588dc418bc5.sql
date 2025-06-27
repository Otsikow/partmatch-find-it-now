
-- Create seller verification table
CREATE TABLE public.seller_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  email TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  seller_type TEXT NOT NULL CHECK (seller_type IN ('Individual', 'Garage/Shop', 'Supplier/Importer')),
  business_name TEXT,
  business_registration_number TEXT,
  business_address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  government_id_url TEXT,
  business_registration_url TEXT,
  proof_of_address_url TEXT,
  profile_photo_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies for seller verifications
CREATE POLICY "Users can view their own verification" 
  ON public.seller_verifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification" 
  ON public.seller_verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own verification" 
  ON public.seller_verifications 
  FOR UPDATE 
  USING (auth.uid() = user_id AND verification_status = 'pending');

-- Admin policies (assuming admins have user_type = 'admin' in profiles table)
CREATE POLICY "Admins can view all verifications" 
  ON public.seller_verifications 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update verifications" 
  ON public.seller_verifications 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-documents', 'verification-documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their verification documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'verification-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own verification documents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'verification-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all verification documents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'verification-documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
