import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    // Verify admin authentication
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get request data
    const { role } = await request.json()

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Prevent admin from demoting themselves
    const { params } = context;
    if (decoded.userId === params.id && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 }
      )
    }

    // Update user role
    const updateResult = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, params.id));

    const affectedRows = updateResult[0]?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch updated user
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id));

    console.log(`User ${params.id} role updated to ${role}`)

    return NextResponse.json({ 
      success: true, 
      user: updatedUser[0]
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}
