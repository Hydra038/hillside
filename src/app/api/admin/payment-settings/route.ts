import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return false
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded.role === 'ADMIN'
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

    const paymentSettings = await prisma.paymentSetting.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(paymentSettings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { error: 'Unable to load payment settings' },
      { status: 500 }
    );
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
    const { type, displayName, display_name, description, enabled, config } = body

    // Handle both displayName and display_name for backward compatibility
    const finalDisplayName = displayName || display_name

    const newPaymentSetting = await prisma.paymentSetting.create({
      data: {
        type,
        displayName: finalDisplayName,
        description,
        enabled: enabled || true,
        config: config || {}
      }
    });

    return NextResponse.json(newPaymentSetting, { status: 201 })
  } catch (error) {
    console.error('Error creating payment setting:', error)
    return NextResponse.json(
      { error: 'Failed to create payment setting', details: String(error) },
      { status: 500 }
    )
  }
}
