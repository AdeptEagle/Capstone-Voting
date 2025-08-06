# Gmail Setup Guide for Voting System

This guide will help you set up Gmail for sending password reset emails in your voting system.

## Prerequisites

1. A Gmail account
2. Access to your Railway backend deployment
3. 2-Factor Authentication enabled on your Gmail account

## Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account Settings](https://myaccount.google.com/)
2. Click on **"Security"** in the left sidebar
3. Under **"Signing in to Google"**, find **"2-Step Verification"**
4. Click **"Get started"** and follow the setup process
5. You can use SMS, authenticator app, or security key

## Step 2: Generate App Password

1. After enabling 2FA, go back to **"Security"**
2. Under **"2-Step Verification"**, click **"App passwords"**
3. You may need to verify your password again
4. Select **"Mail"** from the dropdown
5. Select **"Other (Custom name)"** and enter "Voting System"
6. Click **"Generate"**
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

## Step 3: Configure Railway Environment Variables

1. Go to your Railway dashboard
2. Select your backend service
3. Go to the **"Variables"** tab
4. Add these environment variables:

```bash
# Gmail Configuration
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Frontend URL
FRONTEND_URL=https://sscelection2025.vercel.app
```

### Example:
```bash
GMAIL_USER=myvotingsystem@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

## Step 4: Deploy and Test

1. **Redeploy your backend** in Railway
2. The new environment variables will be applied
3. Test the password reset functionality

## Step 5: Test the Email System

You can test the email system by:

1. Going to your frontend: `https://capstone-voting.vercel.app`
2. Using the "Forgot Password" feature
3. Check Railway logs for email sending status

## Troubleshooting

### Common Issues:

#### 1. "Gmail authentication failed"
- **Solution**: Ensure 2FA is enabled and you're using an App Password, not your regular Gmail password

#### 2. "Gmail connection failed"
- **Solution**: Check your internet connection and Railway's network access

#### 3. "Invalid email address"
- **Solution**: Verify the recipient email address is valid

#### 4. "Gmail timeout"
- **Solution**: Try again later, Gmail servers might be busy

### Security Best Practices:

1. **Never commit credentials to Git**
2. **Use App Passwords, not your main password**
3. **Rotate App Passwords regularly**
4. **Monitor Railway logs for any issues**

### Alternative Email Providers:

If you prefer not to use Gmail, you can modify the EmailService to use:
- SendGrid
- Mailgun
- Amazon SES
- Your own SMTP server

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GMAIL_USER` | Your Gmail address | `myvotingsystem@gmail.com` |
| `GMAIL_APP_PASSWORD` | 16-character app password | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | Your frontend URL | `https://capstone-voting.vercel.app` |

## Testing Commands

You can test the email service by calling the health endpoint:
```
GET https://your-railway-backend-url/api/password-reset/health
```

## Logs to Monitor

In Railway logs, look for:
- `📧 Initializing Gmail email transporter...`
- `✅ Gmail transporter verified successfully`
- `📧 Sending email via Gmail...`
- `✅ Email sent successfully via Gmail`

If you see any errors, they will be clearly logged with specific error messages to help you troubleshoot. 