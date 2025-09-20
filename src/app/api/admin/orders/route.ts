import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
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

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders with user information using Prisma
    const allOrders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match expected format
    const ordersWithUsers = allOrders.map(order => ({
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
      itemCount: order.orderItems.length,
      items: order.orderItems.map(item => ({
        id: item.id.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        priceAtTime: item.priceAtTime.toString(),
        product: item.product
      }))
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
