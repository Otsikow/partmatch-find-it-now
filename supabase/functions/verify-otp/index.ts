import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyOTPRequest {
  phone: string
  otp: string
  userData?: {
    first_name?: string
    last_name?: string
    business_name?: string
    country?: string
    user_type?: 'owner' | 'supplier'
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { phone, otp, userData }: VerifyOTPRequest = await req.json()
    
    console.log(`OTP verification for phone ${phone}`)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check OTP from database
    const { data: otpData, error: otpError } = await supabase
      .from('phone_otps')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .eq('verified', false)
      .single()

    if (otpError || !otpData) {
      console.log('Invalid OTP or OTP not found')
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if OTP is expired
    const now = new Date()
    const expiresAt = new Date(otpData.expires_at)
    
    if (now > expiresAt) {
      console.log('OTP expired')
      return new Response(
        JSON.stringify({ error: 'OTP has expired' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mark OTP as verified
    await supabase
      .from('phone_otps')
      .update({ verified: true })
      .eq('phone', phone)
      .eq('otp', otp)

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, user_type')
      .eq('phone', phone)
      .single()

    let authResult
    let profile

    if (existingProfile) {
      // User exists, sign them in
      console.log('Existing user found, signing in')
      
      // For existing users, we'll create a session token
      // Note: This is a simplified approach. In production, you'd want to use Supabase's built-in phone auth
      profile = existingProfile
      authResult = { user: { id: existingProfile.id, phone } }
    } else {
      // New user, create account
      console.log('New user, creating account')
      
      if (!userData) {
        return new Response(
          JSON.stringify({ error: 'User data required for signup' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Create user profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          phone,
          first_name: userData.first_name,
          last_name: userData.last_name,
          country: userData.country || 'Ghana',
          user_type: userData.user_type || 'owner',
          is_verified: true, // Phone verified
          verified_at: new Date().toISOString()
        })
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      profile = newProfile
      authResult = { user: { id: newProfile.id, phone } }
    }

    console.log('OTP verification successful')

    return new Response(
      JSON.stringify({ 
        success: true,
        user: authResult.user,
        profile,
        action: existingProfile ? 'signin' : 'signup'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Verify OTP error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})