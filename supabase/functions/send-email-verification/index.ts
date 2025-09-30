import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailVerificationRequest {
  email: string;
  firstName?: string;
  redirectUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 Manual email verification request');
    
    const { email, firstName, redirectUrl }: EmailVerificationRequest = await req.json();
    
    if (!email) {
      throw new Error('Email is required');
    }

    console.log('📧 Sending verification email to:', email);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found');
      throw new Error('Email service not configured');
    }

    const resend = new Resend(resendApiKey);

    // Generate a simple verification token (in production, use a proper token)
    const verificationToken = btoa(email + '-' + Date.now());
    const baseUrl = redirectUrl || 'https://ytgmzhevgcmvevuwkocz.supabase.co';
    const verificationUrl = `${baseUrl}/email-verification?token=${verificationToken}&email=${encodeURIComponent(email)}&verified=true`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #4F7FE6; font-size: 28px; margin: 0;">Welcome to PartMatch!</h1>
          <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Verify your email to get started</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0;">Almost There${firstName ? ', ' + firstName : ''}!</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
            Thank you for joining PartMatch, Ghana's premier car parts marketplace. To complete your registration and start buying or selling car parts, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #4F7FE6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px; margin: 20px 0 0 0;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #4F7FE6; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
        
        <div style="text-align: center; color: #9ca3af; font-size: 14px;">
          <p>This verification link will expire in 24 hours.</p>
          <p>If you didn't create this account, you can safely ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p>© 2024 PartMatch. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'PartMatch <info@partmatchgh.com>',
      to: [email],
      subject: 'Welcome to PartMatch - Verify Your Email',
      html: emailContent,
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('✅ Verification email sent successfully:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Verification email sent successfully. Please check your inbox and spam folder.',
      email_id: data?.id 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in send email verification:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send verification email'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);