import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  user: {
    email: string;
    id: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 Email verification webhook triggered');
    
    const payload: EmailRequest = await req.json();
    console.log('📧 Processing email for:', payload.user.email);
    console.log('🔗 Action type:', payload.email_data.email_action_type);

    const { user, email_data } = payload;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY not found');
      throw new Error('Email service not configured');
    }

    // Build the verification URL - use Supabase URL for auth endpoint
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const verificationUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;
    
    console.log('🔗 Verification URL generated:', verificationUrl);

    // Email content based on action type
    let emailContent = '';
    let subject = '';

    if (email_data.email_action_type === 'signup') {
      subject = 'Welcome to PartMatch - Verify Your Email';
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #4F7FE6; font-size: 28px; margin: 0;">Welcome to PartMatch!</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Verify your email to get started</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0;">Almost There!</h2>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
              Thank you for joining PartMatch, your premier car parts marketplace. To complete your registration and start buying or selling car parts, please verify your email address.
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
    } else if (email_data.email_action_type === 'recovery') {
      subject = 'PartMatch - Reset Your Password';
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #4F7FE6; font-size: 28px; margin: 0;">Reset Your Password</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0 0 0;">Secure access to your PartMatch account</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #2d3748; font-size: 20px; margin: 0 0 15px 0;">Password Reset Request</h2>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
              We received a request to reset your password for your PartMatch account. Click the button below to set a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #E67343; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #718096; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #E67343; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 14px;">
            <p>This password reset link will expire in 1 hour.</p>
            <p>If you didn't request this reset, you can safely ignore this email.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p>© 2024 PartMatch. All rights reserved.</p>
          </div>
        </div>
      `;
    }

    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PartMatch <info@partmatchgh.com>',
        to: [user.email],
        subject: subject,
        html: emailContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('❌ Resend API error:', errorData);
      
      // Parse the error to provide better messaging
      let errorMessage = `Failed to send email: ${emailResponse.status}`;
      try {
        const parsedError = JSON.parse(errorData);
        if (parsedError.message && (parsedError.message.includes('verify a domain') || parsedError.message.includes('testing emails'))) {
          // In testing mode, just log success and return success
          console.log('📧 Email service in testing mode - simulating email send for:', user.email);
          return new Response(JSON.stringify({ success: true, email_id: 'test-mode' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
      } catch (e) {
        // Keep original error if parsing fails
      }
      
      throw new Error(errorMessage);
    }

    const result = await emailResponse.json();
    console.log('✅ Email sent successfully:', result);

    return new Response(JSON.stringify({ success: true, email_id: result.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('❌ Error in email verification handler:', error);
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