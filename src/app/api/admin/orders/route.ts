import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function GET() {
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

    // Verify JWT and check admin role
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders with user information
    const allOrders = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        total: orders.total,
        status: orders.status,
        shippingAddress: orders.shippingAddress,
        paymentMethod: orders.paymentMethod,
        paymentPlan: orders.paymentPlan,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(orders.createdAt)

    // Transform data to include user info
    const ordersWithUsers = allOrders.map(order => ({
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      paymentPlan: order.paymentPlan,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: {
        name: order.userName,
        email: order.userEmail,
      }
    }))

    return NextResponse.json({ orders: ordersWithUsers })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
