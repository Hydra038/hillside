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
    return decoded.role === 'admin'
  } catch (error) {
    return false
  }
}

// GET - Fetch all payment settings
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: paymentSettings, error } = await supabase
      .from('payment_settings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching payment settings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payment settings' },
        { status: 500 }
      )
    }

    return NextResponse.json(paymentSettings || [])
  } catch (error) {
    console.error('Error fetching payment settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    )
  }
}

// POST - Create new payment setting
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('PaymentSettings POST body:', body)
    const { type, display_name, description, enabled, config } = body

    const { data, error } = await supabase
      .from('payment_settings')
      .insert({
        type,
        display_name,
        description,
        enabled,
        config
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating payment setting:', error)
      return NextResponse.json(
        { error: 'Failed to create payment setting', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating payment setting:', error)
    return NextResponse.json(
      { error: 'Failed to create payment setting', details: String(error) },
      { status: 500 }
    )
  }
}
