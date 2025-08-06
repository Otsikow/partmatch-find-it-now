import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders, checkRateLimit } from '../_shared/cors.ts'

interface OTPRequest {
  phone: string
  action: 'signup' | 'signin'
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Rate limiting - max 5 OTP requests per 5 minutes per IP
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  const rateLimit = checkRateLimit(`otp_${clientIP}`, 5, 300000);
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many OTP requests. Please try again later.' }),
      { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const { phone, action }: OTPRequest = await req.json()
    
    console.log(`OTP request: ${action} for phone ${phone}`)

    // Validate phone number format
    if (!phone || !phone.match(/^\+[1-9]\d{1,14}$/)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

    // Store OTP in database (you'll need to create this table)
    const { error: dbError } = await supabase
      .from('phone_otps')
      .upsert({
        phone,
        otp,
        expires_at: expiresAt.toISOString(),
        action,
        verified: false,
        attempts: 0
      }, {
        onConflict: 'phone'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store OTP' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send SMS via Twilio
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER')

    // Secure logging - don't expose credential details
    console.log('Twilio credentials verification:', {
      credentialsConfigured: !!(twilioSid && twilioToken && twilioPhone)
    })

    if (!twilioSid || !twilioToken || !twilioPhone) {
      console.error('Missing Twilio credentials:', {
        TWILIO_ACCOUNT_SID: !!twilioSid,
        TWILIO_AUTH_TOKEN: !!twilioToken,
        TWILIO_PHONE_NUMBER: !!twilioPhone
      })
      return new Response(
        JSON.stringify({ error: 'SMS service not configured properly. Please check Twilio credentials.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const message = `Your PartMatch verification code is: ${otp}. Valid for 5 minutes.`

    console.log('Sending SMS to:', phone, 'from:', twilioPhone)
    
    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: twilioPhone,
          To: phone,
          Body: message,
        }),
      }
    )

    console.log('Twilio response status:', twilioResponse.status)

    if (!twilioResponse.ok) {
      const twilioError = await twilioResponse.text()
      console.error('Twilio error details:', {
        status: twilioResponse.status,
        statusText: twilioResponse.statusText,
        error: twilioError,
        phone: phone,
        twilioPhone: twilioPhone
      })
      
      let errorMessage = 'Failed to send SMS'
      if (twilioResponse.status === 401) {
        errorMessage = 'Twilio authentication failed. Please check your credentials.'
      } else if (twilioResponse.status === 400) {
        errorMessage = 'Invalid phone number or Twilio configuration.'
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage, details: twilioError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`OTP sent successfully to ${phone}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        expiresIn: 300 // 5 minutes in seconds
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Send OTP error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})