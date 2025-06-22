
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface PaymentRequest {
  offerId: string;
  payerId: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId, payerId, amount, paymentMethod, paymentReference }: PaymentRequest = await req.json();
    
    console.log(`Processing payment for offer: ${offerId}`);

    // Verify payment with Paystack/Flutterwave (mock implementation)
    const paymentVerified = await verifyPayment(paymentReference, amount);
    
    if (!paymentVerified) {
      throw new Error('Payment verification failed');
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payer_id: payerId,
        offer_id: offerId,
        amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        status: 'completed'
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Generate receipt
    const receipt = await generateReceipt(payment);

    // Trigger notification
    await supabase.functions.invoke('send-notifications', {
      body: {
        type: 'payment_confirmed',
        offerId
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment,
        receipt 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function verifyPayment(reference: string, expectedAmount: number): Promise<boolean> {
  // Mock payment verification - replace with actual Paystack/Flutterwave integration
  console.log(`Verifying payment: ${reference} for amount: ${expectedAmount}`);
  
  // In real implementation, you would:
  // 1. Call Paystack/Flutterwave API to verify transaction
  // 2. Check if amount matches
  // 3. Ensure transaction was successful
  
  return true; // Mock success
}

async function generateReceipt(payment: any): Promise<string> {
  const receiptId = `RCP-${Date.now()}`;
  const receiptData = {
    id: receiptId,
    payment_id: payment.id,
    amount: payment.amount,
    currency: payment.currency,
    date: new Date().toISOString(),
    payment_method: payment.payment_method,
    reference: payment.payment_reference
  };

  // In a real implementation, you might:
  // 1. Generate PDF receipt
  // 2. Store in Supabase Storage
  // 3. Send via email
  
  console.log('Receipt generated:', receiptData);
  return receiptId;
}

serve(handler);
