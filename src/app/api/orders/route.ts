import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
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
    const userOrders = await prisma.order.findMany({
      where: {
        userId: decoded.userId
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

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
      paymentMethod,
      paymentPlan,
      itemsSample: items?.[0]
    })

    // Fetch payment method name if paymentMethod ID is provided
    let paymentMethodName = null
    if (paymentMethod) {
      try {
        const paymentSetting = await prisma.paymentSetting.findUnique({
          where: { id: parseInt(paymentMethod.toString()) }
        })
        paymentMethodName = paymentSetting?.displayName || paymentMethod.toString()
      } catch (err) {
        console.log('Orders POST: Could not fetch payment method name, using ID:', paymentMethod)
        paymentMethodName = paymentMethod.toString()
      }
    }

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

    try {
      console.log('Orders POST: Creating order in database')
      const createdOrder = await prisma.order.create({
        data: {
          id: orderId,
          userId: decoded.userId,
          total: total.toString(),
          shippingAddress,
          paymentMethod: paymentMethodName,
          paymentPlan: paymentPlan || null,
          status: 'PENDING'
        }
      })
      console.log('Orders POST: Order created successfully:', createdOrder)
    } catch (err) {
      console.error('Orders POST: Error during order creation:', err);
      throw err;
    }

    // Create order items
    try {
      console.log('Orders POST: Creating order items')
      const orderItemsData = items.map(item => ({
        orderId: orderId,
        productId: parseInt(item.id.toString()),
        quantity: parseInt(item.quantity.toString()),
        priceAtTime: item.price.toString()
      }))

      const createdOrderItems = await prisma.orderItem.createMany({
        data: orderItemsData
      })
      console.log('Orders POST: Order items created successfully:', createdOrderItems)
    } catch (err) {
      console.error('Orders POST: Error during order items creation:', err);
      throw err;
    }

    // Return success response with order ID
    console.log('Orders POST: Order and items created successfully, returning success');
    return NextResponse.json({ 
      success: true, 
      orderId,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Orders POST: Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
