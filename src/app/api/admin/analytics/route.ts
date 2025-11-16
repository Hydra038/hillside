import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Return empty analytics for now (orders table might be empty)
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    if (ordersError) {
      console.error('Error fetching orders for analytics:', ordersError)
    }

    const orders = ordersData || []
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total || '0'), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Get customer count
    const { count: totalCustomers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers: totalCustomers || 0,
      averageOrderValue,
      recentOrders: [],
      topProducts: [],
      monthlyRevenue: [],
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      recentOrders: [],
      topProducts: [],
      monthlyRevenue: [],
    })
  }
}
