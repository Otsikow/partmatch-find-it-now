import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

interface ResendRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 Resend verification email request');
    
    const { email }: ResendRequest = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    console.log('📧 Resending verification for email:', email);

    // Use Supabase's resend method
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'partmatch.app')}/auth?verified=true`,
      },
    });

    if (error) {
      console.error('❌ Failed to resend verification:', error);
      
      // Handle specific error cases
      if (error.message.includes('Email not found') || error.message.includes('User not found')) {
        throw new Error('No account found with this email address. Please sign up first.');
      } else if (error.message.includes('Email already confirmed')) {
        throw new Error('This email address is already verified. You can sign in directly.');
      } else if (error.message.includes('Too many requests')) {
        throw new Error('Too many requests. Please wait a few minutes before requesting another verification email.');
      }
      
      throw new Error(`Failed to resend verification email: ${error.message}`);
    }

    console.log('✅ Verification email resent successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Verification email sent successfully. Please check your inbox and spam folder.' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in resend verification:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to resend verification email'
      }),
      {
        status: 400,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);