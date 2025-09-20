import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
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

    if (decoded.role !== 'ADMIN') {
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

    // Get total orders with revenue
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const totalOrders = orders.length

    // Get total customers (users created in period)
    const totalCustomers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Get all orders for broader statistics
    const allOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        total: true
      }
    })

    const allOrdersRevenue = allOrders.reduce((sum, order) => sum + Number(order.total), 0)
    const allOrdersCount = allOrders.length
    const averageOrderValue = allOrdersCount > 0 ? allOrdersRevenue / allOrdersCount : 0

    // Get top products (simplified - would need order items)
    const topProducts = await prisma.product.findMany({
      select: {
        name: true,
        stockQuantity: true,
        price: true
      },
      orderBy: {
        stockQuantity: 'desc'
      },
      take: 10
    })

    // Generate monthly revenue data (simplified)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i, 1)
      monthStart.setHours(0, 0, 0, 0)

      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)

      const monthOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: monthStart,
            lt: monthEnd
          }
        },
        select: {
          total: true
        }
      })

      const monthRevenue = monthOrders.reduce((sum, order) => sum + Number(order.total), 0)

      monthlyRevenue.push({
        month: monthStart.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        revenue: monthRevenue,
        orders: monthOrders.length,
      })
    }

    return NextResponse.json({
      totalRevenue: allOrdersRevenue,
      totalOrders: allOrdersCount,
      totalCustomers,
      averageOrderValue,
      recentOrders: orders.map(order => ({
        id: order.id,
        total: Number(order.total),
        createdAt: order.createdAt,
        customerName: order.user?.name || 'Unknown Customer'
      })),
      topProducts: topProducts.map(product => ({
        name: product.name,
        quantity: product.stockQuantity,
        revenue: Number(product.price),
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
