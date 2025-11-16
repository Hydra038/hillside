import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

// Only allow this to be called for the first user in the system
// or by an existing admin
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Get token from cookies and verify admin role
    const headersList = await headers()
    const token = headersList.get('cookie')?.split('auth-token=')[1]?.split(';')[0]
    
    // Check if there are any users in the system
    const { data: allUsers, error: countError } = await supabaseAdmin
      .from('users')
      .select('id')
    
    if (countError) throw countError
    
    const isFirstUser = !allUsers || allUsers.length === 0

    // If not first user, verify admin role
    if (!isFirstUser) {
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload
        if (decoded.role?.toLowerCase() !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
    }

    // Update user role to admin using Supabase
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role: 'ADMIN' })
      .eq('email', email)
      .select()
      .single()

    if (updateError || !updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
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
