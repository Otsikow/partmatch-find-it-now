import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OTPRequest {
  phone: string
  action: 'signup' | 'signin'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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

    console.log('Twilio credentials check:', {
      sidExists: !!twilioSid,
      tokenExists: !!twilioToken,
      phoneExists: !!twilioPhone,
      sidLength: twilioSid?.length || 0,
      tokenLength: twilioToken?.length || 0
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