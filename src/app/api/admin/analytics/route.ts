import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { orders, orderItems, products, users } from '@/lib/db/schema.mysql'
import { eq, gte, lt, sql, desc, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get total revenue and orders
    const revenueData = await db
      .select({
        totalRevenue: sql`COALESCE(SUM(${orders.total}), 0)`,
        totalOrders: sql`COUNT(${orders.id})`,
      })
      .from(orders)
      .where(gte(orders.createdAt, startDate))

    // Get total customers
    const customerData = await db
      .select({
        totalCustomers: sql`COUNT(${users.id})`,
      })
      .from(users)
      .where(gte(users.createdAt, startDate))

    // Get recent orders with customer info
    const recentOrders = await db
      .select({
        id: orders.id,
        total: orders.total,
        createdAt: orders.createdAt,
        customerName: users.name,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(gte(orders.createdAt, startDate))
      .orderBy(desc(orders.createdAt))
      .limit(10)

    // Get top products
    const topProducts = await db
      .select({
        name: products.name,
        quantity: sql`COALESCE(SUM(${orderItems.quantity}), 0)`,
        revenue: sql`COALESCE(SUM(${orderItems.priceAtTime}), 0)`,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(orders, eq(orderItems.orderId, orders.id))
      .where(gte(orders.createdAt, startDate))
      .groupBy(products.id, products.name)
      .orderBy(desc(sql`SUM(${orderItems.quantity})`))
      .limit(10)

    // Get monthly revenue (simplified for last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i, 1)
      monthStart.setHours(0, 0, 0, 0)

      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)

      const monthData = await db
        .select({
          revenue: sql`COALESCE(SUM(${orders.total}), 0)`,
          orders: sql`COUNT(${orders.id})`,
        })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, monthStart),
            lt(orders.createdAt, monthEnd)
          )
        )

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        revenue: Number(monthData[0]?.revenue || 0),
        orders: Number(monthData[0]?.orders || 0),
      })
    }

    const totalRevenue = Number(revenueData[0]?.totalRevenue || 0)
    const totalOrders = Number(revenueData[0]?.totalOrders || 0)
    const totalCustomers = Number(customerData[0]?.totalCustomers || 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      recentOrders: recentOrders.map(order => ({
        ...order,
        customerName: order.customerName || 'Unknown Customer'
      })),
      topProducts: topProducts.map(product => ({
        name: product.name || 'Unknown Product',
        quantity: Number(product.quantity || 0),
        revenue: Number(product.revenue || 0),
      })),
      monthlyRevenue,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
