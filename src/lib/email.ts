import { Resend } from 'resend'

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    // If no Resend API key is configured, just log the reset link
    if (!process.env.RESEND_API_KEY || !resend) {
      console.log('⚠️  No RESEND_API_KEY configured. Reset link:')
      console.log('🔗 Reset URL:', resetUrl)
      console.log('📧 For:', email)
      return true
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [email],
      subject: 'Reset Your Password - Firewood Logs & Fuel',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 40px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #d97706;
              }
              .content {
                margin-bottom: 30px;
              }
              .button {
                display: inline-block;
                background-color: #d97706;
                color: #ffffff;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
                text-align: center;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🔥 Firewood Logs & Fuel</div>
              </div>
              
              <div class="content">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
                
                <div class="warning">
                  <strong>⚠️ Security Notice:</strong>
                  <ul style="margin: 8px 0;">
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Never share this link with anyone</li>
                  </ul>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an automated message from Firewood Logs & Fuel.</p>
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Error sending password reset email:', error)
      throw new Error('Failed to send password reset email')
    }

    console.log('✅ Password reset email sent successfully:', data)
    return true
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    throw error
  }
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    // If no Resend API key is configured, just log
    if (!process.env.RESEND_API_KEY || !resend) {
      console.log('⚠️  No RESEND_API_KEY configured. Email details:')
      console.log('📧 To:', to)
      console.log('📋 Subject:', subject)
      return true
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('❌ Error sending email:', error)
      throw new Error('Failed to send email')
    }

    console.log('✅ Email sent successfully:', data)
    return true
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw error
  }
}
