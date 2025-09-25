import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface VerifyRequest {
  token_hash: string;
  type: string;
  redirect_to?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 Email verification token processing started');
    
    const { token_hash, type, redirect_to }: VerifyRequest = await req.json();
    
    console.log('📧 Verifying token:', { type, has_token: !!token_hash });

    if (!token_hash || !type) {
      throw new Error('Missing required parameters: token_hash and type');
    }

    // Verify the token with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error('❌ Token verification failed:', error);
      throw new Error(`Verification failed: ${error.message}`);
    }

    console.log('✅ Token verified successfully');

    // If this is an email verification, update the user's email_confirmed_at
    if (type === 'signup' && data.user) {
      console.log('📧 Email verification confirmed for user:', data.user.id);
      
      // The user's email is now confirmed
      // Redirect to success page or login
      const redirectUrl = redirect_to || `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'partmatch.app')}/auth?verified=true`;
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders,
        },
      });
    }

    // For password recovery, redirect to password reset form
    if (type === 'recovery' && data.session) {
      const redirectUrl = redirect_to || `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'partmatch.app')}/auth?reset=true&access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`;
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders,
        },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Verification successful',
      user: data.user?.id
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in token verification:', error);
    
    // Redirect to error page with message
    const errorUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'partmatch.app')}/auth?error=${encodeURIComponent(error.message)}`;
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': errorUrl,
        ...corsHeaders,
      },
    });
  }
};

serve(handler);