import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the authentication cookie
    const response = NextResponse.json({ success: true })
    
    // Remove the auth-token cookie (matches the name set in signin)
    response.cookies.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Immediately expire the cookie
    })

    // Also try to delete it directly
    cookieStore.delete('auth-token')

    console.log('User signed out successfully')
    
    return response
  } catch (error) {
    console.error('Error in signout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
