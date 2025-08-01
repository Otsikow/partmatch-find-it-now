
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

interface FCMMessage {
  notification: {
    title: string;
    body: string;
    icon?: string;
  };
  data?: Record<string, string>;
  token: string;
}

async function sendPushNotification(message: FCMMessage) {
  try {
    const serverKey = Deno.env.get('FCM_SERVER_KEY');
    if (!serverKey) {
      console.warn('FCM_SERVER_KEY not configured, skipping push notification');
      return { success: false, error: 'FCM not configured' };
    }

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: message.token,
        notification: message.notification,
        data: message.data,
        priority: 'high',
        content_available: true,
      }),
    });

    const result = await response.json();
    
    if (response.ok && result.success === 1) {
      return { success: true, result };
    } else {
      console.error('FCM send failed:', result);
      return { success: false, error: result.results?.[0]?.error || 'Unknown FCM error' };
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
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
  console.log('Handling new request notification for request:', requestId);
  
  // Get request details
  const { data: request } = await supabase
    .from('part_requests')
    .select('*, profiles!owner_id(*)')
    .eq('id', requestId)
    .single();

  if (!request) {
    console.log('Request not found:', requestId);
    return;
  }

  console.log('Request details:', request);

  // Find all verified suppliers (we'll notify all verified sellers)  
  const { data: suppliers } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, push_token, push_notifications_enabled')
    .eq('user_type', 'supplier')
    .eq('is_verified', true);

  console.log('Found verified suppliers:', suppliers?.length);

  let pushNotificationsSent = 0;
  let pushNotificationsFailed = 0;

  // Create user notifications and send push notifications for all verified suppliers
  for (const supplier of suppliers || []) {
    const title = `New Part Request: ${request.part_needed}`;
    const message = `${request.car_make} ${request.car_model} (${request.car_year}) - ${request.location}`;
    
    // Create in-app notification
    await createUserNotification(
      supplier.id, 
      'new_request', 
      title,
      message,
      {
        requestId: requestId,
        make: request.car_make,
        model: request.car_model,
        year: request.car_year,
        part: request.part_needed,
        location: request.location,
        link: `/seller-dashboard?tab=requests`
      }
    );
    
    // Send push notification if supplier has push token and enabled
    if (supplier.push_token && supplier.push_notifications_enabled !== false) {
      const pushMessage: FCMMessage = {
        notification: {
          title: '🔔 New Part Request',
          body: `${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}) in ${request.location}`,
          icon: '/lovable-uploads/967579eb-1ffe-4731-ab56-b38a24cbc330.png'
        },
        data: {
          url: `/seller-dashboard?tab=requests`,
          request_id: requestId,
          type: 'new_request'
        },
        token: supplier.push_token
      };

      const pushResult = await sendPushNotification(pushMessage);
      
      // Log push notification attempt
      await supabase
        .from('push_notification_logs')
        .insert({
          user_id: supplier.id,
          notification_type: 'new_request',
          title: pushMessage.notification.title,
          body: pushMessage.notification.body,
          status: pushResult.success ? 'sent' : 'failed',
          error_message: pushResult.success ? null : pushResult.error,
          metadata: {
            request_id: requestId,
            fcm_result: pushResult.result
          }
        });

      if (pushResult.success) {
        pushNotificationsSent++;
        console.log(`Push notification sent to supplier: ${supplier.id}`);
      } else {
        pushNotificationsFailed++;
        console.warn(`Push notification failed for supplier ${supplier.id}:`, pushResult.error);
      }
    }
    
    console.log(`Notification created for supplier: ${supplier.id}`);
  }

  console.log(`Push notifications summary: ${pushNotificationsSent} sent, ${pushNotificationsFailed} failed`);
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

// Create user notification in the user_notifications table
async function createUserNotification(
  userId: string, 
  type: string, 
  title: string,
  message: string, 
  metadata?: any
) {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        metadata,
        read: false
      });

    if (error) {
      console.error('Error creating user notification:', error);
    } else {
      console.log(`User notification created: ${type} for user ${userId}`);
    }
  } catch (error) {
    console.error('Failed to create user notification:', error);
  }
}

// Legacy function for backwards compatibility
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

  console.log(`Notification queued: ${type} to ${recipient} - ${message}`);
}

serve(handler);
