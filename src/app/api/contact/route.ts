import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email to support
    const supportEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">New Contact Form Submission</h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #374151;">Message:</h3>
          <p style="color: #4b5563; line-height: 1.6;">${message}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;">
            <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #d97706;">${email}</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@firewoodlogsfuel.com',
      subject: `Contact Form: ${subject}`,
      html: supportEmailContent,
    });

    // Send confirmation email to customer
    const customerEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Thank You for Contacting Us!</h2>
        <p style="color: #4b5563;">Hi ${name},</p>
        <p style="color: #4b5563;">We've received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151;">Your message:</h3>
          <p style="color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
          <p style="color: #4b5563; line-height: 1.6;">${message}</p>
        </div>
        
        <p style="color: #4b5563;">
          In the meantime, you can reach us via:
        </p>
        <ul style="color: #4b5563;">
          <li>WhatsApp: +44 7878 779622</li>
          <li>Email: support@firewoodlogsfuel.com</li>
        </ul>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 14px;">
            Best regards,<br>
            <strong style="color: #d97706;">Hillside Logs Fuel Team</strong>
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'We received your message - Hillside Logs Fuel',
      html: customerEmailContent,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! We\'ll get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
