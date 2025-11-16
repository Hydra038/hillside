import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  const cookieStore = await cookies(); const token = cookieStore.get('token')?.value
  
  return NextResponse.json({
    hasJwtSecret: !!process.env.JWT_SECRET,
    tokenPresent: !!token,
    cookieValue: token,
    tokenDecodeAttempt: token ? jwt.decode(token) : null
  })
}
