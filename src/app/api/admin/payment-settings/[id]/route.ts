import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const token = (await cookieStore).get('auth-token')?.value
  
  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded.role?.toLowerCase() === 'admin'
  } catch (error) {
    return false
  }
}

// PUT - Update payment setting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, displayName, description, enabled, config } = body

    const updateData: any = {}
    if (type !== undefined) updateData.type = type
    if (displayName !== undefined) updateData.display_name = displayName
    if (description !== undefined) updateData.description = description
    if (enabled !== undefined) updateData.enabled = enabled
    if (config !== undefined) updateData.config = config

    const { data, error } = await supabase
      .from('payment_settings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating payment setting:', error)
      return NextResponse.json(
        { error: 'Failed to update payment setting', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Payment setting not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating payment setting:', error)
    return NextResponse.json(
      { error: 'Failed to update payment setting' },
      { status: 500 }
    )
  }
}

// PATCH - Partial update payment setting (same as PUT for compatibility)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params })
}

// DELETE - Delete payment setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('payment_settings')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error deleting payment setting:', error)
      return NextResponse.json(
        { error: 'Failed to delete payment setting', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Payment setting not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Payment setting deleted successfully' })
  } catch (error) {
    console.error('Error deleting payment setting:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment setting' },
      { status: 500 }
    )
  }
}
