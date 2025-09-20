import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sendEmail, generateShippingNotificationEmailHtml, ShippingNotificationData } from '@/lib/send-email'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params to fix Next.js 15 compatibility
    const { id } = await params;
    
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      console.error('PATCH /api/admin/orders/[id]: No auth-token cookie');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT and check admin role
    if (!process.env.JWT_SECRET) {
      console.error('PATCH /api/admin/orders/[id]: JWT_SECRET not set');
      throw new Error('JWT_SECRET is not defined');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
      };
    } catch (jwtErr) {
      console.error('PATCH /api/admin/orders/[id]: JWT verification failed', jwtErr);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      console.error('PATCH /api/admin/orders/[id]: User is not admin', decoded);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get request data
    let status;
    try {
      const body = await request.json();
      status = body.status;
    } catch (jsonErr) {
      console.error('PATCH /api/admin/orders/[id]: Failed to parse JSON body', jsonErr);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      console.error('PATCH /api/admin/orders/[id]: Invalid status value', status);
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order status
    let updatedOrder;
    try {
      updatedOrder = await prisma.order.update({
        where: { id },
        data: { 
          status,
          updatedAt: new Date()
        }
      });
    } catch (dbErr) {
      console.error('PATCH /api/admin/orders/[id]: DB update error', dbErr);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (!updatedOrder) {
      console.error('PATCH /api/admin/orders/[id]: No order found to update', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log(`Order ${id} status updated to ${status} by admin ${decoded.email}`);

    // If status is changed to 'shipped', send notification email
    if (status === 'shipped') {
      try {
        // Get order with user details for email
        const orderForEmail = await prisma.order.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            },
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        });

        if (orderForEmail?.user?.email) {
          // Parse shipping address
          let shippingAddress;
          try {
            shippingAddress = typeof orderForEmail.shippingAddress === 'string' 
              ? JSON.parse(orderForEmail.shippingAddress)
              : orderForEmail.shippingAddress;
          } catch {
            shippingAddress = {
              street: 'Address not available',
              city: '',
              postcode: '',
              country: 'UK'
            };
          }

          const emailData: ShippingNotificationData = {
            customerName: orderForEmail.user.name || 'Valued Customer',
            orderId: orderForEmail.id.slice(0, 8),
            orderDate: new Date(orderForEmail.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            total: Number(orderForEmail.total).toFixed(2),
            items: orderForEmail.orderItems.map(item => ({
              name: item.product?.name || 'Product',
              quantity: item.quantity,
              price: Number(item.priceAtTime || 0).toFixed(2)
            })),
            shippingAddress: {
              street: shippingAddress.street || '',
              city: shippingAddress.city || '',
              postcode: shippingAddress.postcode || '',
              country: shippingAddress.country || 'UK'
            },
            trackingNumber: undefined, // Can be added later if tracking system implemented
            estimatedDelivery: undefined // Can be calculated based on location
          };

          const emailHtml = generateShippingNotificationEmailHtml(emailData);
          
          await sendEmail({
            to: orderForEmail.user.email,
            subject: '🚚 Your Firewood Order Has Shipped! - Hillside Logs Fuel',
            html: emailHtml
          });

          console.log(`✅ Shipping notification email sent to ${orderForEmail.user.email} for order ${id}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send shipping notification email:', emailError);
        // Don't fail the order update if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder
    });
  } catch (error) {
    console.error('PATCH /api/admin/orders/[id]: Unexpected error', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to fix Next.js 15 compatibility
    const { id } = await params;
    
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get specific order with user and order items details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform to match expected format
    const orderWithDetails = {
      id: order.id,
      userId: order.userId,
      total: order.total.toString(),
      status: order.status,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentPlan: order.paymentPlan,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user,
      items: order.orderItems.map(item => ({
        id: item.id.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        priceAtTime: item.priceAtTime.toString(),
        product: item.product
      }))
    };

    return NextResponse.json({ order: orderWithDetails })
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
