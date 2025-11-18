import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import jwt from 'jsonwebtoken'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
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

    // Get request data
    const { status } = await request.json()

    // Validate status (accept lowercase)
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Convert to uppercase for database enum
    const dbStatus = status.toUpperCase()

    // Update order status using Supabase
    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: dbStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating order:', error)
      console.error('Order ID:', id, 'Status:', status)
      return NextResponse.json(
        { error: `Failed to update order: ${error.message}` },
        { status: 500 }
      )
    }
    
    if (!updatedOrder) {
      console.error('Order not found with ID:', id)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    console.log(`Order ${id} status updated to ${status} by admin ${decoded.email}`)

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
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

    // Get specific order with user and order items details using Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        users (
          name,
          email
        ),
        order_items (
          *,
          products (
            name,
            price
          )
        )
      `)
      .eq('id', id)
      .single()

    if (orderError || !order) {
      console.error('Supabase error fetching order:', orderError)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform to expected format
    const orderWithDetails = {
      id: order.id,
      userId: order.user_id,
      total: order.total,
      status: order.status,
      shippingAddress: order.shipping_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      user: {
        name: order.users?.name || 'Unknown',
        email: order.users?.email || 'No email',
      },
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        quantity: item.quantity,
        priceAtTime: item.price_at_time,
        product: {
          name: item.products?.name || 'Unknown Product',
          price: item.products?.price || '0',
        },
      })),
    }

    return NextResponse.json({ order: orderWithDetails })
  } catch (error) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
