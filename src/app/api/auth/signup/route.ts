import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('Signup API called')
    const { name, email, password } = await request.json()
    console.log('Signup data received:', { name, email, password: '***' })

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined')
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test database connection first
    console.log('Testing database connection...')
    try {
      const testQuery = await sql`SELECT 1 as test`
      console.log('Database connection test successful:', testQuery)
    } catch (dbError) {
      console.error('Database connection test failed:', dbError)
      throw dbError
    }

    // Check what tables exist
    console.log('Checking available tables...')
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      console.log('Available tables:', tables)
    } catch (tableError) {
      console.error('Failed to check tables:', tableError)
    }

    // Check if user exists using raw SQL
    console.log('Checking if user exists...')
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    console.log('Existing user check result:', existingUser)
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user using raw SQL
    console.log('Creating new user...')
    const newUser = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'user')
      RETURNING id, name, email
    `

    console.log('User created successfully:', newUser[0])
    return NextResponse.json({ 
      user: { 
        id: newUser[0].id, 
        name: newUser[0].name, 
        email: newUser[0].email 
      } 
    })
  } catch (error) {
    console.error('Error in signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
