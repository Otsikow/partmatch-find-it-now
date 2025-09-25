import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationEmailData {
  email: string;
  firstName: string;
  lastName: string;
  verificationToken: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: VerificationEmailData = await req.json();
    
    console.log('Sending verification email to:', data.email);
    
    await sendVerificationEmail(data);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Verification email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

async function sendVerificationEmail(data: VerificationEmailData) {
  const verificationUrl = `${data.redirectUrl}?token=${data.verificationToken}&type=signup`;

  const emailData = {
    from: 'PartMatch <verification@resend.dev>',
    to: data.email,
    subject: 'Verify your PartMatch account',
    html: `
      <div style="font-family: 'Roboto', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #263238; font-size: 28px; margin: 0; font-weight: 700;">Welcome to PartMatch!</h1>
            <p style="color: #607d8b; font-size: 16px; margin: 10px 0 0 0;">Your professional car parts marketplace</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #263238; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi ${data.firstName} ${data.lastName},
            </p>
            <p style="color: #263238; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for joining PartMatch! To complete your registration and start accessing our marketplace, please verify your email address by clicking the button below.
            </p>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background: #263238; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
              Verify Email Address
            </a>
          </div>
          
          <div style="background: #e6e9ec; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #607d8b; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
              Can't click the button? Copy and paste this link:
            </p>
            <p style="color: #607d8b; font-size: 14px; margin: 0; word-break: break-all;">
              ${verificationUrl}
            </p>
          </div>
          
          <div style="border-top: 1px solid #e6e9ec; padding-top: 20px; margin-top: 30px;">
            <p style="color: #607d8b; font-size: 14px; margin: 0 0 10px 0;">
              This verification link will expire in 24 hours for security reasons.
            </p>
            <p style="color: #607d8b; font-size: 14px; margin: 0;">
              If you didn't create a PartMatch account, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e6e9ec;">
            <p style="color: #607d8b; font-size: 12px; margin: 0;">
              Best regards,<br>
              The PartMatch Team
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send verification email: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Verification email sent successfully:', result);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

serve(handler);