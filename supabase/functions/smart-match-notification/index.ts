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

interface SmartMatchRequest {
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId }: SmartMatchRequest = await req.json();
    
    console.log(`Processing smart match for request: ${requestId}`);

    // Get request details with owner info
    const { data: request, error: requestError } = await supabase
      .from('part_requests')
      .select(`
        *,
        profiles!owner_id(*)
      `)
      .eq('id', requestId)
      .single();

    if (requestError || !request) {
      throw new Error(`Request not found: ${requestError?.message}`);
    }

    console.log(`Request found: ${request.part_needed} for ${request.car_make} ${request.car_model}`);

    // Find matching sellers based on criteria
    const matchingSellers = await findMatchingSellers(request);
    
    console.log(`Found ${matchingSellers.length} matching sellers`);

    // Send notifications to matching sellers
    const notificationResults = await Promise.allSettled(
      matchingSellers.map(seller => sendSmartMatchNotification(request, seller))
    );

    const successCount = notificationResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = notificationResults.filter(result => result.status === 'rejected').length;

    console.log(`Notifications sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: successCount,
        notificationsFailed: failureCount,
        sellersMatched: matchingSellers.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Smart match notification error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function findMatchingSellers(request: any) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Search for sellers with matching criteria
  const { data: sellers, error } = await supabase
    .from('profiles')
    .select(`
      *,
      car_parts!supplier_id(*)
    `)
    .eq('user_type', 'supplier')
    .eq('is_blocked', false)
    .not('notification_preferences->request_notifications', 'eq', false);

  if (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }

  // Filter sellers based on matching criteria
  const matchingSellers = sellers?.filter(seller => {
    // Check if seller has notification preferences enabled
    const notifPrefs = seller.notification_preferences || {};
    if (notifPrefs.request_notifications === false) {
      return false;
    }

    // Check location match (same country or region)
    const locationMatch = checkLocationMatch(request.location, seller.location, request.country, seller.country);
    
    // Check if seller has listed similar parts in the last 30 days
    const hasRecentSimilarParts = seller.car_parts?.some((part: any) => {
      const partDate = new Date(part.created_at);
      const isRecent = partDate >= thirtyDaysAgo;
      const isPartMatch = checkPartMatch(request, part);
      return isRecent && isPartMatch;
    });

    return locationMatch && hasRecentSimilarParts;
  }) || [];

  return matchingSellers;
}

function checkLocationMatch(requestLocation: string, sellerLocation: string, requestCountry: string, sellerCountry: string): boolean {
  // First check country match
  if (requestCountry && sellerCountry) {
    if (requestCountry.toLowerCase() === sellerCountry.toLowerCase()) {
      return true;
    }
  }

  // Then check if locations contain similar terms
  if (!requestLocation || !sellerLocation) return false;
  
  const reqLocationLower = requestLocation.toLowerCase();
  const sellerLocationLower = sellerLocation.toLowerCase();
  
  // Check for exact match or substring match
  return reqLocationLower.includes(sellerLocationLower) || 
         sellerLocationLower.includes(reqLocationLower) ||
         reqLocationLower === sellerLocationLower;
}

function checkPartMatch(request: any, part: any): boolean {
  const requestPartLower = request.part_needed.toLowerCase();
  const partTypeLower = part.part_type?.toLowerCase() || '';
  const partTitleLower = part.title?.toLowerCase() || '';
  
  // Check for car make and model match
  const carMatch = (
    request.car_make.toLowerCase() === part.make.toLowerCase() &&
    request.car_model.toLowerCase() === part.model.toLowerCase()
  );
  
  // Check for part type match (exact or partial)
  const partMatch = (
    partTypeLower.includes(requestPartLower) ||
    requestPartLower.includes(partTypeLower) ||
    partTitleLower.includes(requestPartLower) ||
    requestPartLower.includes(partTitleLower)
  );
  
  return carMatch && partMatch;
}

async function sendSmartMatchNotification(request: any, seller: any) {
  const matchCriteria = {
    location_match: checkLocationMatch(request.location, seller.location, request.country, seller.country),
    recent_similar_parts: true,
    request_notifications_enabled: true
  };

  // Create notification record
  const { error: logError } = await supabase
    .from('smart_match_notifications')
    .insert({
      request_id: request.id,
      seller_id: seller.id,
      match_criteria: matchCriteria,
      email_sent: false,
      in_app_sent: false
    });

  if (logError) {
    console.error('Error logging smart match notification:', logError);
  }

  // Create in-app notification
  const inAppMessage = `New buyer requesting ${request.part_needed} for ${request.car_make} ${request.car_model} (${request.car_year}) in ${request.location}. You recently listed similar parts - respond now!`;
  
  const { error: inAppError } = await supabase
    .from('user_notifications')
    .insert({
      user_id: seller.id,
      type: 'smart_match',
      title: 'New Part Request Match',
      message: inAppMessage,
      metadata: {
        request_id: request.id,
        part_needed: request.part_needed,
        car_make: request.car_make,
        car_model: request.car_model,
        car_year: request.car_year,
        location: request.location
      }
    });

  if (inAppError) {
    console.error('Error creating in-app notification:', inAppError);
    throw new Error(`Failed to send in-app notification: ${inAppError.message}`);
  }

  // Update notification log to mark in-app as sent
  await supabase
    .from('smart_match_notifications')
    .update({ in_app_sent: true })
    .eq('request_id', request.id)
    .eq('seller_id', seller.id);

  // Send email notification if enabled
  const notifPrefs = seller.notification_preferences || {};
  if (notifPrefs.email_notifications !== false && seller.email) {
    try {
      await sendEmailNotification(request, seller, inAppMessage);
      
      // Update notification log to mark email as sent
      await supabase
        .from('smart_match_notifications')
        .update({ email_sent: true })
        .eq('request_id', request.id)
        .eq('seller_id', seller.id);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't throw error for email failures, in-app notification is already sent
    }
  }

  console.log(`Smart match notification sent to seller ${seller.id} for request ${request.id}`);
  return { success: true, seller_id: seller.id };
}

async function sendEmailNotification(request: any, seller: any, message: string) {
  // Call the existing send-contact-email function for email notifications
  const emailPayload = {
    to: seller.email,
    subject: `New Part Request Match - ${request.part_needed}`,
    html: `
      <h2>New Part Request Match!</h2>
      <p>Hello ${seller.first_name || 'Seller'},</p>
      <p>${message}</p>
      <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 8px;">
        <h3>Request Details:</h3>
        <ul>
          <li><strong>Part Needed:</strong> ${request.part_needed}</li>
          <li><strong>Vehicle:</strong> ${request.car_make} ${request.car_model} (${request.car_year})</li>
          <li><strong>Location:</strong> ${request.location}</li>
          <li><strong>Description:</strong> ${request.description || 'No additional details'}</li>
        </ul>
      </div>
      <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://app.')}/seller-dashboard" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Request & Respond</a></p>
      <p>Best regards,<br>PartMatch Team</p>
    `
  };

  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-contact-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    throw new Error(`Email service failed: ${response.statusText}`);
  }
}

serve(handler);