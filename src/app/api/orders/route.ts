import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/lib/email'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_id', decoded.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ orders: [] })
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return NextResponse.json({ orders: [] })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    const { items, total, shippingAddress, paymentMethod } = await request.json()

    // Get user details
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('name, email')
      .eq('id', decoded.userId)
      .single()

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: decoded.userId,
        total: total.toString(),
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send order confirmation email
    if (user) {
      try {
        const itemsHtml = items.map((item: any) => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px;">${item.name}</td>
            <td style="padding: 12px; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')

        const orderConfirmationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #d97706 0%, #92400e 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0;">Order Confirmed!</h1>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px;">
              <p style="font-size: 16px; color: #374151;">Hi ${user.name},</p>
              <p style="font-size: 16px; color: #374151;">Thank you for your order! We've received your payment and are preparing your firewood for delivery.</p>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #d97706; margin-top: 0;">Order Details</h2>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
                <p style="color: #6b7280; margin: 5px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed</span></p>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d97706;">
                    <th style="padding: 12px; text-align: left;">Product</th>
                    <th style="padding: 12px; text-align: center;">Quantity</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #d97706;">
                    <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #d97706;">£${Number(total).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">Delivery Information</h3>
                <p style="color: #78350f; margin: 5px 0;">${shippingAddress.street}</p>
                <p style="color: #78350f; margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.postcode}</p>
                <p style="color: #78350f; margin: 5px 0;">${shippingAddress.country}</p>
              </div>
              
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #166534; margin-top: 0;">What's Next?</h3>
                <ul style="color: #166534; line-height: 1.8;">
                  <li>We'll prepare your order for delivery</li>
                  <li>You'll receive a notification when your order is dispatched</li>
                  <li>Track your order status in your account</li>
                </ul>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions about your order, please don't hesitate to contact us:
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                📞 WhatsApp: +44 7878 779622<br>
                📧 Email: support@firewoodlogsfuel.com
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Thank you for choosing Hillside Logs Fuel!
              </p>
            </div>
          </div>
        `

        await sendEmail({
          to: user.email,
          subject: `Order Confirmation #${order.id} - Hillside Logs Fuel`,
          html: orderConfirmationHtml,
        })
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError)
        // Don't fail the order if email fails
      }
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
