import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, orderItems, products, users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
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
    let updateResult;
    try {
      updateResult = await db
        .update(orders)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(orders.id, id));
    } catch (dbErr) {
      console.error('PATCH /api/admin/orders/[id]: DB update error', dbErr);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    const affectedRows = updateResult[0]?.affectedRows ?? 0;
    if (affectedRows === 0) {
      console.error('PATCH /api/admin/orders/[id]: No order found to update', id);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch updated order
    let updatedOrder;
    try {
      updatedOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id));
    } catch (fetchErr) {
      console.error('PATCH /api/admin/orders/[id]: Error fetching updated order', fetchErr);
      return NextResponse.json(
        { error: 'Failed to fetch updated order' },
        { status: 500 }
      );
    }

    console.log(`Order ${id} status updated to ${status} by admin ${decoded.email}`);

    // If status is changed to 'shipped', send notification email
    if (status === 'shipped') {
      try {
        // Get order with user details for email
        const orderForEmail = await db
          .select({
            id: orders.id,
            total: orders.total,
            createdAt: orders.createdAt,
            shippingAddress: orders.shippingAddress,
            userName: users.name,
            userEmail: users.email,
          })
          .from(orders)
          .leftJoin(users, eq(orders.userId, users.id))
          .where(eq(orders.id, id))
          .limit(1);

        // Get order items for email
        const emailOrderItems = await db
          .select({
            quantity: orderItems.quantity,
            priceAtTime: orderItems.priceAtTime,
            productName: products.name,
          })
          .from(orderItems)
          .leftJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, id));

        if (orderForEmail.length > 0 && orderForEmail[0].userEmail) {
          const order = orderForEmail[0];
          
          // Parse shipping address
          let shippingAddress;
          try {
            shippingAddress = typeof order.shippingAddress === 'string' 
              ? JSON.parse(order.shippingAddress)
              : order.shippingAddress;
          } catch {
            shippingAddress = {
              street: 'Address not available',
              city: '',
              postcode: '',
              country: 'UK'
            };
          }

          const emailData: ShippingNotificationData = {
            customerName: order.userName || 'Valued Customer',
            orderId: order.id.slice(0, 8),
            orderDate: new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            total: Number(order.total).toFixed(2),
            items: emailOrderItems.map(item => ({
              name: item.productName || 'Product',
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
            to: order.userEmail!,
            subject: '🚚 Your Firewood Order Has Shipped! - Hillside Logs Fuel',
            html: emailHtml
          });

          console.log(`✅ Shipping notification email sent to ${order.userEmail} for order ${id}`);
        }
      } catch (emailError) {
        console.error('❌ Failed to send shipping notification email:', emailError);
        // Don't fail the order update if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder[0]
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
  const orderQuery = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        total: orders.total,
        status: orders.status,
        shippingAddress: orders.shippingAddress,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id))
      .limit(1)

    if (orderQuery.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get order items with product details
    const orderItemsQuery = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        priceAtTime: orderItems.priceAtTime,
        productName: products.name,
        productPrice: products.price,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))

    const order = orderQuery[0]
    const orderWithDetails = {
      ...order,
      user: {
        name: order.userName,
        email: order.userEmail,
      },
      items: orderItemsQuery.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
        product: {
          name: item.productName,
          price: item.productPrice,
        },
      })),
    }

    return NextResponse.json({ order: orderWithDetails })
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
