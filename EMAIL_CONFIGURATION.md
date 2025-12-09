# Email Configuration

## Overview
The application uses email for:
- Password reset links
- Order confirmations
- Contact form submissions

## Configuration

### Development (Optional)
For development, email functionality is **optional**. If `RESEND_API_KEY` is not configured:
- The app will work normally
- Email content will be logged to the console instead
- No emails will actually be sent

### Production (Required)
For production, you should configure email using **Resend**:

1. **Sign up for Resend**: https://resend.com
2. **Get your API key** from the dashboard
3. **Add to `.env.local`**:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

## Testing Emails in Development

Without configuration, check the server console for email content:
```
⚠️  No RESEND_API_KEY configured. Email details:
📧 To: customer@example.com
📋 Subject: Order Confirmation
```

## Resend Setup Guide

### Step 1: Create Account
1. Go to https://resend.com
2. Sign up for a free account (100 emails/day)

### Step 2: Get API Key
1. Go to API Keys section
2. Click "Create API Key"
3. Copy the key (starts with `re_`)

### Step 3: Verify Domain (Optional but Recommended)
1. Go to Domains section
2. Add your domain
3. Add DNS records as instructed
4. Once verified, update `EMAIL_FROM` to use your domain

### Step 4: Update Environment Variables
```bash
# .env.local
RESEND_API_KEY=re_your_actual_key_here
EMAIL_FROM=noreply@yourdomain.com  # or onboarding@resend.dev for testing
```

### Step 5: Restart Server
```bash
npm run dev
```

## Email Types

### 1. Password Reset
- **Triggered**: When user clicks "Forgot Password"
- **Sent to**: User's registered email
- **Contains**: Reset link valid for 1 hour

### 2. Order Confirmation
- **Triggered**: After successful checkout
- **Sent to**: Customer email
- **Contains**: Order details, items, total, delivery address

### 3. Contact Form
- **Triggered**: When user submits contact form
- **Sent to**: 
  - Customer (confirmation)
  - Support email (notification)

## Troubleshooting

### "Missing API key" Error
- Check `.env.local` file exists
- Verify `RESEND_API_KEY` is set
- Restart the development server

### Emails Not Sending
- Check console for error messages
- Verify API key is valid
- Check Resend dashboard for logs
- Verify domain is verified (if using custom domain)

### Testing
1. No API key = emails logged to console ✅
2. With API key = emails sent via Resend ✅

## Cost
- **Free tier**: 100 emails/day, 3,000/month
- **Perfect for**: Development and small businesses
- **Production**: Consider upgrading for higher volume
