
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

interface SpamCheckRequest {
  phone: string;
  userId: string;
  requestData: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, userId, requestData }: SpamCheckRequest = await req.json();
    
    console.log(`Checking for spam: ${phone}`);

    // Check for duplicate requests
    const duplicateCheck = await checkDuplicateRequests(phone, requestData);
    if (duplicateCheck.isDuplicate) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'duplicate_request',
          message: 'Similar request already exists from this phone number' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check rate limiting
    const rateLimit = await checkRateLimit(phone, userId);
    if (rateLimit.exceeded) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'rate_limit',
          message: `Too many requests. Try again in ${rateLimit.waitTime} minutes.`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check for suspicious patterns
    const suspiciousCheck = await checkSuspiciousPatterns(phone, requestData);
    if (suspiciousCheck.isSuspicious) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'suspicious_activity',
          message: 'Request flagged for manual review'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ allowed: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Anti-spam check error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function checkDuplicateRequests(phone: string, requestData: any) {
  const { data: existingRequests } = await supabase
    .from('part_requests')
    .select('*')
    .eq('phone', phone)
    .eq('car_make', requestData.car_make)
    .eq('car_model', requestData.car_model)
    .eq('part_needed', requestData.part_needed)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .neq('status', 'completed');

  return {
    isDuplicate: (existingRequests?.length || 0) > 0
  };
}

async function checkRateLimit(phone: string, userId: string) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Check requests from this phone in the last hour
  const { data: hourlyRequests } = await supabase
    .from('part_requests')
    .select('id')
    .eq('phone', phone)
    .gte('created_at', oneHourAgo.toISOString());

  // Check requests from this user in the last day
  const { data: dailyRequests } = await supabase
    .from('part_requests')
    .select('id')
    .eq('owner_id', userId)
    .gte('created_at', oneDayAgo.toISOString());

  const hourlyLimit = 3; // Max 3 requests per hour per phone
  const dailyLimit = 10; // Max 10 requests per day per user

  if ((hourlyRequests?.length || 0) >= hourlyLimit) {
    return { exceeded: true, waitTime: 60 };
  }

  if ((dailyRequests?.length || 0) >= dailyLimit) {
    return { exceeded: true, waitTime: 1440 }; // 24 hours
  }

  return { exceeded: false };
}

async function checkSuspiciousPatterns(phone: string, requestData: any) {
  // Check for common spam patterns
  const suspiciousKeywords = ['test', 'spam', 'fake', 'bot'];
  const hasSpamKeywords = suspiciousKeywords.some(keyword => 
    requestData.part_needed?.toLowerCase().includes(keyword) ||
    requestData.description?.toLowerCase().includes(keyword)
  );

  // Check for unusual part requests (very expensive parts might be fraud)
  const expensiveKeywords = ['engine', 'transmission', 'ecu', 'airbag'];
  const isExpensivePart = expensiveKeywords.some(keyword => 
    requestData.part_needed?.toLowerCase().includes(keyword)
  );

  return {
    isSuspicious: hasSpamKeywords || (isExpensivePart && !requestData.description)
  };
}

serve(handler);
