
-- Add contact unlock fee field to offers table
ALTER TABLE public.offers 
ADD COLUMN IF NOT EXISTS contact_unlock_fee DECIMAL(10,2) DEFAULT 5.00;

-- Add verification status for suppliers
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_documents TEXT[],
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Update the payments table to support Mobile Money
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS mobile_money_provider TEXT,
ADD COLUMN IF NOT EXISTS mobile_money_number TEXT;

-- Add Ghana-specific location data
CREATE TABLE IF NOT EXISTS public.ghana_regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  major_cities TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Ghana regions and major cities
INSERT INTO public.ghana_regions (name, major_cities) VALUES
('Greater Accra', ARRAY['Accra', 'Tema', 'Kasoa', 'Madina', 'Adenta']),
('Ashanti', ARRAY['Kumasi', 'Obuasi', 'Ejisu', 'Mampong', 'Konongo']),
('Western', ARRAY['Sekondi-Takoradi', 'Tarkwa', 'Prestea', 'Axim', 'Half Assini']),
('Central', ARRAY['Cape Coast', 'Elmina', 'Winneba', 'Kasoa', 'Swedru']),
('Eastern', ARRAY['Koforidua', 'Akosombo', 'Nkawkaw', 'Akim Oda', 'Mpraeso']),
('Northern', ARRAY['Tamale', 'Yendi', 'Savelugu', 'Gushegu', 'Tolon']),
('Volta', ARRAY['Ho', 'Hohoe', 'Keta', 'Aflao', 'Denu']),
('Upper East', ARRAY['Bolgatanga', 'Navrongo', 'Bawku', 'Paga', 'Zebilla']),
('Upper West', ARRAY['Wa', 'Lawra', 'Jirapa', 'Nadowli', 'Tumu']),
('Brong Ahafo', ARRAY['Sunyani', 'Techiman', 'Berekum', 'Dormaa Ahenkro', 'Kintampo'])
ON CONFLICT DO NOTHING;

-- Create RLS policies for ghana_regions
ALTER TABLE public.ghana_regions ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the policy to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view Ghana regions" ON public.ghana_regions;
CREATE POLICY "Anyone can view Ghana regions" ON public.ghana_regions FOR SELECT USING (true);

-- Add Mobile Money payment processing function
CREATE OR REPLACE FUNCTION public.process_contact_unlock_payment(
  offer_id_param UUID,
  payment_method_param TEXT,
  mobile_money_provider_param TEXT DEFAULT NULL,
  mobile_money_number_param TEXT DEFAULT NULL,
  payment_reference_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  offer_record RECORD;
  payment_record RECORD;
  result JSON;
BEGIN
  -- Get offer details
  SELECT * INTO offer_record FROM public.offers WHERE id = offer_id_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Offer not found');
  END IF;
  
  -- Check if contact is already unlocked
  IF offer_record.contact_unlocked THEN
    RETURN json_build_object('success', false, 'error', 'Contact already unlocked');
  END IF;
  
  -- Create payment record
  INSERT INTO public.payments (
    payer_id,
    offer_id,
    amount,
    payment_method,
    mobile_money_provider,
    mobile_money_number,
    payment_reference,
    status
  ) VALUES (
    auth.uid(),
    offer_id_param,
    offer_record.contact_unlock_fee,
    payment_method_param,
    mobile_money_provider_param,
    mobile_money_number_param,
    payment_reference_param,
    'pending'
  ) RETURNING * INTO payment_record;
  
  RETURN json_build_object(
    'success', true,
    'payment_id', payment_record.id,
    'amount', payment_record.amount,
    'payment_method', payment_record.payment_method
  );
END;
$$;

-- Add function to update verification status
CREATE OR REPLACE FUNCTION public.update_supplier_verification(
  supplier_id_param UUID,
  is_verified_param BOOLEAN,
  documents_param TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    is_verified = is_verified_param,
    verification_documents = COALESCE(documents_param, verification_documents),
    verified_at = CASE WHEN is_verified_param THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE id = supplier_id_param;
  
  RETURN FOUND;
END;
$$;
