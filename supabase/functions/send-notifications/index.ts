
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

interface NotificationRequest {
  type: 'new_request' | 'new_offer' | 'payment_confirmed' | 'status_update';
  requestId?: string;
  offerId?: string;
  userId?: string;
  customMessage?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, requestId, offerId, userId, customMessage }: NotificationRequest = await req.json();
    
    console.log(`Processing notification: ${type}`);

    switch (type) {
      case 'new_request':
        await handleNewRequestNotification(requestId!);
        break;
      case 'new_offer':
        await handleNewOfferNotification(offerId!);
        break;
      case 'payment_confirmed':
        await handlePaymentConfirmedNotification(offerId!);
        break;
      case 'status_update':
        await handleStatusUpdateNotification(requestId!, customMessage);
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function handleNewRequestNotification(requestId: string) {
  // Get request details
  const { data: request } = await supabase
    .from('part_requests')
    .select('*, profiles!owner_id(*)')
    .eq('id', requestId)
    .single();

  if (!request) return;

  // Find suppliers in the same location
  const { data: suppliers } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'supplier')
    .eq('is_blocked', false)
    .ilike('location', `%${request.location}%`);

  // Send notifications to matching suppliers
  for (const supplier of suppliers || []) {
    const message = `New part request: ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}) in ${request.location}`;
    
    await createNotification(supplier.id, 'whatsapp', supplier.phone, message);
  }
}

async function handleNewOfferNotification(offerId: string) {
  // Get offer and request details
  const { data: offer } = await supabase
    .from('offers')
    .select('*, part_requests!request_id(*, profiles!owner_id(*)), profiles!supplier_id(*)')
    .eq('id', offerId)
    .single();

  if (!offer) return;

  const message = `You received an offer of GHS ${offer.price} for your ${offer.part_requests.part_needed} request from a verified supplier!`;
  
  await createNotification(
    offer.part_requests.owner_id,
    'whatsapp',
    offer.part_requests.profiles.phone,
    message
  );

  // Update request status
  await supabase
    .from('part_requests')
    .update({ status: 'offer_received' })
    .eq('id', offer.request_id);
}

async function handlePaymentConfirmedNotification(offerId: string) {
  // Get offer details
  const { data: offer } = await supabase
    .from('offers')
    .select('*, part_requests!request_id(*, profiles!owner_id(*)), profiles!supplier_id(*)')
    .eq('id', offerId)
    .single();

  if (!offer) return;

  // Update offer to unlock contact
  await supabase
    .from('offers')
    .update({ contact_unlocked: true })
    .eq('id', offerId);

  // Update request status
  await supabase
    .from('part_requests')
    .update({ status: 'contact_unlocked' })
    .eq('id', offer.request_id);

  // Notify both parties
  const ownerMessage = `Payment confirmed! Supplier contact: ${offer.profiles.phone}. You can now contact them directly.`;
  const supplierMessage = `Customer paid for your offer! Customer contact: ${offer.part_requests.profiles.phone}`;

  await createNotification(
    offer.part_requests.owner_id,
    'whatsapp',
    offer.part_requests.profiles.phone,
    ownerMessage
  );

  await createNotification(
    offer.supplier_id,
    'whatsapp',
    offer.profiles.phone,
    supplierMessage
  );
}

async function handleStatusUpdateNotification(requestId: string, message?: string) {
  const { data: request } = await supabase
    .from('part_requests')
    .select('*, profiles!owner_id(*)')
    .eq('id', requestId)
    .single();

  if (!request || !message) return;

  await createNotification(
    request.owner_id,
    'whatsapp',
    request.profiles.phone,
    message
  );
}

async function createNotification(userId: string, type: string, recipient: string, message: string) {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      recipient,
      message,
      sent: false
    });

  // In a real implementation, you would integrate with WhatsApp Business API, SMS service, etc.
  console.log(`Notification queued: ${type} to ${recipient} - ${message}`);
}

serve(handler);
