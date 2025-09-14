import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, orderItems, products, users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
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
        .where(eq(orders.id, params.id));
    } catch (dbErr) {
      console.error('PATCH /api/admin/orders/[id]: DB update error', dbErr);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    const affectedRows = updateResult[0]?.affectedRows ?? 0;
    if (affectedRows === 0) {
      console.error('PATCH /api/admin/orders/[id]: No order found to update', params.id);
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
        .where(eq(orders.id, params.id));
    } catch (fetchErr) {
      console.error('PATCH /api/admin/orders/[id]: Error fetching updated order', fetchErr);
      return NextResponse.json(
        { error: 'Failed to fetch updated order' },
        { status: 500 }
      );
    }

    console.log(`Order ${params.id} status updated to ${status} by admin ${decoded.email}`);

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
  { params }: { params: { id: string } }
) {
  try {
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
      .where(eq(orders.id, params.id))
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
      .where(eq(orderItems.orderId, params.id))

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
