import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, orderItems, products } from '@/lib/db/schema.mysql'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    // Verify authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify JWT and get user ID
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    }

    // Get user's orders with items
    const userOrders = await db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        shippingAddress: orders.shippingAddress,
      })
      .from(orders)
      .where(eq(orders.userId, decoded.userId))
      .orderBy(orders.createdAt)

    return NextResponse.json({ orders: userOrders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('Orders POST: Starting order creation')
    
    // Verify authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value

    if (!token) {
      console.log('Orders POST: No token found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify JWT and get user ID
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    }

    console.log('Orders POST: User authenticated:', decoded.userId)

    // Get order data from request
  const { items, total, shippingAddress, paymentMethod, paymentPlan } = await request.json()
    
    console.log('Orders POST: Received data:', { 
      itemsCount: items?.length, 
      total, 
      shippingAddress,
      itemsSample: items?.[0]
    })

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Orders POST: Invalid items')
      return NextResponse.json(
        { error: 'Invalid order items' },
        { status: 400 }
      )
    }

    // Validate item structure
    for (const item of items) {
      if (!item.id || !item.quantity || !item.price) {
        console.log('Orders POST: Invalid item structure:', item)
        return NextResponse.json(
          { error: 'Invalid item data: missing id, quantity, or price' },
          { status: 400 }
        )
      }
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      console.log('Orders POST: Invalid shipping address')
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      )
    }

    // Create order with generated UUID
    console.log('Orders POST: Creating order in database')
    const orderId = randomUUID();
    const orderData = {
      id: orderId,
      userId: decoded.userId,
      total: total.toString(),
      shippingAddress,
      paymentMethod: paymentMethod || null,
      paymentPlan: paymentPlan || null,
      status: 'pending' as const
    }
    console.log('Orders POST: Order data:', orderData)

    try {
      const insertResult = await db.insert(orders).values(orderData);
      console.log('Orders POST: Order insert result:', insertResult);
      // Fetch the inserted order for debugging
      const [insertedOrder] = await db.select().from(orders).where(eq(orders.id, orderId));
      console.log('Orders POST: Inserted order:', insertedOrder);
    } catch (err) {
      console.error('Orders POST: Error during order insert:', err);
      throw err;
    }

    // Create order items
    try {
      console.log('Orders POST: Creating order items')
      const orderItemsResult = await db.insert(orderItems).values(
        items.map(item => ({
          orderId: orderId,
          productId: parseInt(item.id.toString()), // Ensure integer type
          quantity: parseInt(item.quantity.toString()), // Ensure integer type
          priceAtTime: item.price.toString() // Ensure string for numeric type
        }))
      )
      console.log('Orders POST: Order items insert result:', orderItemsResult);
    } catch (err) {
      console.error('Orders POST: Error during order items insert:', err);
      throw err;
    }

    // Fetch and return the inserted order for debugging
    const [finalOrder] = await db.select().from(orders).where(eq(orders.id, orderId));
    console.log('Orders POST: Order completed successfully, returning:', finalOrder);
    return NextResponse.json({ success: true, orderId, order: finalOrder })
  } catch (error) {
    console.error('Orders POST: Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
