import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    // Verify admin authentication
    const cookieStore = await cookies()
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

    if (decoded.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all users
    const { data: allUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false })

    if (usersError) throw usersError

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      (allUsers || []).map(async (user) => {
        const { data: userOrders, error: ordersError } = await supabaseAdmin
          .from('orders')
          .select('total')
          .eq('user_id', user.id)

        const orderCount = userOrders?.length || 0
        const totalSpent = (userOrders || []).reduce((sum, order) => {
          return sum + (parseFloat(order.total) || 0)
        }, 0)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          orderCount,
          totalSpent: totalSpent.toString()
        }
      })
    )

    return NextResponse.json({ users: usersWithStats })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
