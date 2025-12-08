# Email Setup for Password Reset

This application uses **Resend** for sending password reset emails. Resend is a modern email API that's perfect for Next.js and serverless environments.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Firewood Store - Production")
5. Copy the API key (starts with `re_`)

### 3. Add Domain (For Production)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `firewoodlogsfuel.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually takes a few minutes)

**Note:** For testing, you can use `onboarding@resend.dev` as the sender email.

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Email sender (use your verified domain or onboarding@resend.dev for testing)
EMAIL_FROM=noreply@yourdomain.com

# Or for testing:
# EMAIL_FROM=onboarding@resend.dev

# Base URL for reset links
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
# Or for development:
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Test the Email Flow

1. Start your dev server: `npm run dev`
2. Go to `/forgot-password`
3. Enter your email address
4. Check your email for the reset link

**Without API Key (Development):**
- The reset link will be logged to the console
- You can copy and test it manually

**With API Key:**
- Real emails will be sent via Resend
- Check your inbox (and spam folder)

## Email Template

The password reset email includes:
- Professional HTML design
- Clickable "Reset Password" button
- Fallback text link
- Security warnings
- 1-hour expiration notice

## Troubleshooting

### Email not sending
1. Check your RESEND_API_KEY is correct
2. Verify EMAIL_FROM domain is verified in Resend
3. Check server logs for error messages

### Email goes to spam
1. Verify your domain in Resend
2. Add SPF and DKIM records
3. Use a professional from address

### Reset link doesn't work
1. Check NEXT_PUBLIC_BASE_URL is set correctly
2. Ensure the token hasn't expired (1 hour limit)
3. Check browser console for errors

## Cost

- **Free Tier**: 3,000 emails/month
- **Pro Plan**: $20/month for 50,000 emails
- No credit card required for free tier

## Alternative Options

If you prefer a different email service:

1. **SendGrid**: Popular choice, 100 emails/day free
2. **Mailgun**: 5,000 emails/month free
3. **Postmark**: 100 emails/month free
4. **Amazon SES**: Very cheap, pay-as-you-go

Just update `src/lib/email.ts` with your preferred service's SDK.
