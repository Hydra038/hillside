import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from '@/lib/supabase-admin'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function PUT(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    // Get request body
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email is already taken by another user
    if (email !== decoded.email) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser && existingUser.id !== decoded.userId) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        )
      }
    }

    // Update user in database
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        name,
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', decoded.userId)
      .select()
      .single()

    if (error || !updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If email changed, generate new token
    let newToken = token
    if (email !== decoded.email) {
      newToken = jwt.sign(
        {
          userId: decoded.userId,
          email: email,
          role: decoded.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    // Create response
    const response = NextResponse.json({
      user: userWithoutPassword,
      success: true
    })

    // Update cookie if email changed
    if (email !== decoded.email) {
      response.cookies.set({
        name: 'auth-token',
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })
    }

    return response

  } catch (error) {
    console.error('Error updating profile:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
