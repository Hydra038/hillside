import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
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

    // Verify JWT and check admin role
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    }

    if (decoded.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders using Supabase
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Supabase error fetching orders:', ordersError)
      return NextResponse.json({ orders: [] })
    }

    // Get all users to join with orders
    const { data: usersData } = await supabaseAdmin
      .from('users')
      .select('id, name, email')

    const usersMap = new Map(usersData?.map(u => [u.id, u]) || [])

    // Transform data to match expected format
    const ordersWithUsers = (ordersData || []).map((order: any) => {
      const user = usersMap.get(order.user_id)
      return {
        id: order.id,
        userId: order.user_id,
        total: order.total,
        status: order.status,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        user: {
          name: user?.name || 'Unknown',
          email: user?.email || 'No email',
        }
      }
    })

    return NextResponse.json({ orders: ordersWithUsers })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    // Return empty array instead of error to prevent UI crash
    return NextResponse.json({ orders: [] })
  }
}
