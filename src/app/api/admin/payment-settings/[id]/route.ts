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

// PUT - Update payment setting
export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, displayName, display_name, description, enabled, config } = body;
    const params = await context.params;
    const id = parseInt(params.id);

    // Handle both displayName and display_name for backward compatibility
    const finalDisplayName = displayName || display_name

    const updatedPaymentSetting = await prisma.paymentSetting.update({
      where: { id },
      data: {
        type,
        displayName: finalDisplayName,
        description,
        enabled: enabled !== undefined ? enabled : undefined,
        config: config || {}
      }
    });

    return NextResponse.json(updatedPaymentSetting);
  } catch (error) {
    console.error('Error updating payment setting:', error);
    return NextResponse.json(
      { error: 'Unable to update payment setting' },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment setting
export async function DELETE(
  request: NextRequest,
  context: any
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = parseInt(params.id);

    await prisma.paymentSetting.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Payment setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment setting:', error);
    return NextResponse.json(
      { error: 'Unable to delete payment setting' },
      { status: 500 }
    );
  }
}
