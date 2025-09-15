interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // For testing purposes, we'll log the email to the console
  // In production, you would integrate with a real email service like SendGrid, AWS SES, etc.
  
  console.log('\n📧 EMAIL SENT - Testing Mode');
  console.log('=====================================');
  console.log(`📧 TO: ${options.to}`);
  console.log(`📧 SUBJECT: ${options.subject}`);
  console.log('📧 HTML CONTENT:');
  console.log(options.html);
  console.log('=====================================\n');

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 100));
}

export function generateVerificationEmailHtml(name: string, verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - Hillside Logs Fuel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #d97706, #ea580c); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 30px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .button:hover { background: #b45309; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔥 Hillside Logs Fuel</h1>
          <p>Welcome to our community!</p>
        </div>
        <div class="content">
          <h2>Hi ${name}!</h2>
          <p>Thank you for signing up with Hillside Logs Fuel. To complete your registration and start ordering premium firewood, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${verificationLink}" class="button">Verify My Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">${verificationLink}</p>
          
          <p>This verification link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <hr style="margin: 30px 0; border: 1px solid #eee;">
          
          <p><strong>What's next?</strong></p>
          <ul>
            <li>Browse our premium firewood selection</li>
            <li>Enjoy free local delivery</li>
            <li>Get expert advice on firewood storage</li>
            <li>Access special member discounts</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 Hillside Logs Fuel. All rights reserved.</p>
          <p>Quality firewood delivered to your door.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export interface ShippingNotificationData {
  customerName: string;
  orderId: string;
  orderDate: string;
  total: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export function generateShippingNotificationEmailHtml(data: ShippingNotificationData): string {
  const trackingSection = data.trackingNumber 
    ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0; color: #28a745;">📦 Tracking Information</h3>
        <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
        ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Shipped! - Hillside Logs Fuel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 30px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .order-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item-row:last-child { border-bottom: none; }
        .total-row { font-weight: bold; font-size: 16px; margin-top: 10px; padding-top: 10px; border-top: 2px solid #d97706; }
        .button { display: inline-block; background: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; text-align: center; }
        .button:hover { background: #b45309; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .status-badge { background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Order Shipped!</h1>
          <p>Your firewood is on its way</p>
        </div>
        <div class="content">
          <h2>Hi ${data.customerName}!</h2>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <span class="status-badge">✅ SHIPPED</span>
          </div>

          ${trackingSection}

          <div class="order-details">
            <h3 style="margin-top: 0; color: #d97706;">📋 Order Details</h3>
            <p><strong>Order ID:</strong> #${data.orderId}</p>
            <p><strong>Order Date:</strong> ${data.orderDate}</p>
            
            <h4 style="margin-bottom: 10px;">Items Ordered:</h4>
            ${data.items.map(item => `
              <div class="item-row">
                <div>
                  <strong>${item.name}</strong><br>
                  <small>Quantity: ${item.quantity}</small>
                </div>
                <div>£${item.price}</div>
              </div>
            `).join('')}
            
            <div class="item-row total-row">
              <div>Total</div>
              <div>£${data.total}</div>
            </div>
          </div>

          <div class="order-details">
            <h3 style="margin-top: 0; color: #d97706;">🚚 Delivery Address</h3>
            <p>
              ${data.shippingAddress.street}<br>
              ${data.shippingAddress.city}<br>
              ${data.shippingAddress.postcode}<br>
              ${data.shippingAddress.country}
            </p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'}/account" class="button">
              View Order & Download Invoice
            </a>
          </div>

          <hr style="margin: 30px 0; border: 1px solid #eee;">
          
          <h3>📞 Need Help?</h3>
          <p>If you have any questions about your delivery, please don't hesitate to contact us:</p>
          <ul>
            <li>📧 Email: support@firewoodlogsfuel.com</li>
            <li>📱 WhatsApp: +44 7878 779622</li>
            <li>🕐 Monday - Friday: 9AM - 5PM</li>
          </ul>

          <p><strong>Delivery Tips:</strong></p>
          <ul>
            <li>🏠 Please ensure someone is available to receive the delivery</li>
            <li>🚛 Our delivery team will contact you before arrival</li>
            <li>📦 Firewood will be stacked in your preferred location (if accessible)</li>
            <li>🌧️ We deliver in all weather conditions</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 Hillside Logs Fuel. All rights reserved.</p>
          <p>Thank you for choosing our premium firewood delivery service!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
