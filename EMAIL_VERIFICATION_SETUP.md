# Email Verification Setup Guide

## Current Issue
Users are not receiving verification emails because Supabase's default email system may not be properly configured.

## Solution: Configure Supabase Email Settings

### Step 1: Configure Supabase Email Auth Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ytgmzhevgcmvevuwkocz
2. Navigate to **Authentication** → **Email Templates**
3. Click on **Settings** (or URL Configuration)

### Step 2: Verify Resend Domain Configuration

1. Go to Resend Dashboard: https://resend.com/domains
2. Verify that `partmatchgh.com` domain is:
   - ✅ Verified
   - ✅ DNS records are properly configured
   - ✅ SPF, DKIM, and DMARC records are active

**DNS Records Required:**
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: TXT  
Name: resend._domainkey
Value: [Provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@partmatchgh.com
```

### Step 3: Configure Custom SMTP (Recommended)

In Supabase Dashboard:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Configure with Resend SMTP credentials:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your Resend API Key]
Sender Email: info@partmatchgh.com
Sender Name: PartMatch
```

### Step 4: Alternative - Use Supabase Email Webhook

If Custom SMTP doesn't work, use Email Webhook:

1. Go to **Settings** → **Auth** → **Email Auth**
2. Enable **Custom Email Service**
3. Set Webhook URL to:
```
https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/send-verification-email
```

**Note:** The `send-verification-email` edge function needs to be updated to handle Supabase webhook payloads.

### Step 5: Test the Configuration

After configuration:

1. Try signing up with a new test email
2. Check both inbox and spam folder
3. Verify the email arrives within 2-3 minutes
4. Click the verification link and ensure it redirects properly

## Troubleshooting

### Emails Still Not Arriving

1. **Check Resend Dashboard Logs:**
   - Go to https://resend.com/emails
   - Look for recent email sends
   - Check delivery status and any errors

2. **Check Supabase Auth Logs:**
   - Go to **Logs** → **Auth Logs**
   - Filter for signup events
   - Look for email-related errors

3. **Verify RESEND_API_KEY Secret:**
   - Go to https://supabase.com/dashboard/project/ytgmzhevgcmvevuwkocz/settings/functions
   - Ensure `RESEND_API_KEY` is properly set

4. **Test Edge Function Directly:**
```bash
curl -X POST 'https://ytgmzhevgcmvevuwkocz.supabase.co/functions/v1/send-email-verification' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","firstName":"Test"}'
```

### Common Issues

- **Emails going to spam:** Ensure all DNS records are configured correctly
- **"Email service not configured" error:** Check RESEND_API_KEY is set
- **No emails sent:** Verify Resend domain is verified
- **Wrong redirect URL:** Check emailRedirectTo in code matches your domain

## Current Configuration

- **Project ID:** ytgmzhevgcmvevuwkocz
- **Email Service:** Resend
- **From Email:** info@partmatchgh.com
- **Domain:** partmatchgh.com
- **Edge Functions:** 
  - send-email-verification
  - resend-verification

## Next Steps

After completing the setup:

1. Test with multiple email providers (Gmail, Yahoo, Outlook)
2. Monitor Resend analytics for delivery rates
3. Consider implementing email verification expiry reminders
4. Add email verification status to user dashboard
