import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export async function GET() {
  try {
    const cookieStore = await cookies(); const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET!) as unknown as {
      userId: string
      email: string
      role: string
    }

    // Get user data
    const userResults = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      })
      .from(users)
      .where(eq(users.id, decoded.userId))

    const user = userResults[0]

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}
