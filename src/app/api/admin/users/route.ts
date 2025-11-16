import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users, orders } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    // Verify admin authentication
    const cookieStore = await cookies(); const token = cookieStore.get('auth-token')?.value

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

    // Get all users with order statistics using raw SQL aggregates
    const usersWithStats = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        orderCount: sql`COUNT(${orders.id})`,
        totalSpent: sql`COALESCE(SUM(${orders.total}), 0)`,
      })
      .from(users)
      .leftJoin(orders, eq(users.id, orders.userId))
      .groupBy(users.id, users.name, users.email, users.role, users.createdAt)

    return NextResponse.json({ 
      users: usersWithStats.map(user => ({
        ...user,
        totalSpent: user.totalSpent || '0'
      }))
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
