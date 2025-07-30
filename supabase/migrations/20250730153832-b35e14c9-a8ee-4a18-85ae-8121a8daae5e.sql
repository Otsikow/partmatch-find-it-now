-- Create phone_otps table for storing OTP codes
CREATE TABLE public.phone_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('signup', 'signin')),
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on phone to prevent duplicate OTPs
CREATE UNIQUE INDEX idx_phone_otps_phone ON public.phone_otps(phone);

-- Create index on expires_at for cleanup
CREATE INDEX idx_phone_otps_expires_at ON public.phone_otps(expires_at);

-- Enable RLS
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "System can manage OTPs" ON public.phone_otps
FOR ALL USING (true);

-- Create function to clean up expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.phone_otps 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Add phone column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT UNIQUE;
  END IF;
END $$;