import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

// Only allow this to be called for the first user in the system
// or by an existing admin
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Get token from cookies and verify admin role
    const headersList = await headers()
    const token = headersList.get('cookie')?.split('token=')[1]?.split(';')[0]
    
    // Check if there are any users in the system
    const userCount = await db.select().from(users)
    const isFirstUser = userCount.length === 0

    // If not first user, verify admin role
    if (!isFirstUser) {
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
        if (decoded.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    }

    // Update user role to admin
    const updatedUser = await db.update(users)
      .set({ role: 'admin' })
      .where(eq(users.email, email))
      .returning()

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        role: updatedUser[0].role
      }
    })
  } catch (error) {
    console.error('Error promoting user to admin:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
