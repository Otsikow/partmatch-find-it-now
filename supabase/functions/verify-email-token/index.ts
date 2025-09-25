import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    if (!token || type !== 'signup') {
      return new Response(
        'Invalid verification link',
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log('Processing email verification for token:', token.substring(0, 10) + '...');

    // Look up the verification token in email_verifications table
    const { data: verification, error: verifyError } = await supabaseAdmin
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verification) {
      console.error('Verification token not found or expired:', verifyError);
      return new Response(
        'Verification link expired or invalid. Please request a new one.',
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Mark user as email verified in auth.users
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      verification.user_id,
      { 
        email_confirm: true,
        email_confirmed_at: new Date().toISOString()
      }
    );

    if (updateError) {
      console.error('Error updating user verification status:', updateError);
      throw new Error('Failed to verify email');
    }

    // Mark verification as used
    await supabaseAdmin
      .from('email_verifications')
      .update({ verified: true, verified_at: new Date().toISOString() })
      .eq('id', verification.id);

    console.log('Email verification completed for user:', verification.user_id);

    // Redirect to auth page with success message
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/auth?verified=true`
      }
    });

  } catch (error: any) {
    console.error('Email verification error:', error);
    return new Response(
      `Verification failed: ${error.message}`,
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
};

serve(handler);