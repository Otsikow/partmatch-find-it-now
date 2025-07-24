CREATE OR REPLACE FUNCTION public.process_contact_unlock_payment(
  offer_id_param uuid, 
  payment_method_param text, 
  mobile_money_provider_param text DEFAULT NULL::text, 
  mobile_money_number_param text DEFAULT NULL::text, 
  payment_reference_param text DEFAULT NULL::text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;