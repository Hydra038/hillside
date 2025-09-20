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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
      userId: string;
      email: string;
    }

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all users with order statistics
    const usersData = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            total: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const usersWithStats = usersData.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      orderCount: user.orders.length,
      totalSpent: user.orders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
    }))

    return NextResponse.json({
      users: usersWithStats
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Unable to load users' },
      { status: 500 }
    )
  }
}
