import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('Signup API called')
    const { name, email, password } = await request.json()
    console.log('Signup data received:', { name, email, password: '***' })

    // Check if user exists using Supabase client
    console.log('Checking if user exists...')
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (user doesn't exist, which is what we want)
      console.error('Error checking user:', checkError)
      throw checkError
    }
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user using Supabase client
    console.log('Creating new user...')
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword
        // Don't specify role - let database use default
      })
      .select('id, name, email')
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      throw insertError
    }

    console.log('User created successfully:', newUser)
    return NextResponse.json({ 
      user: newUser
    })
  } catch (error) {
    console.error('Error in signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
