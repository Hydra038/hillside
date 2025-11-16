import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

export async function GET() {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      console.log('/me: No token found');
      return NextResponse.json({ user: null }, { status: 200 })
    }

    if (!process.env.JWT_SECRET) {
      console.error('/me: JWT_SECRET is not defined');
      throw new Error('Server configuration error');
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined')
    }

    const sql = neon(process.env.DATABASE_URL)

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { 
        userId: string;
        email: string;
        role: string;
      }
      
      console.log('/me: Token decoded successfully:', decoded);
      
      // Get user from database using raw SQL
      const user = await sql`
        SELECT id, name, email, role, created_at, updated_at
        FROM users 
        WHERE id = ${decoded.userId}
      `;
      
      if (user.length === 0) {
        console.log('/me: No user found with ID:', decoded.userId);
        return NextResponse.json({ user: null }, { status: 200 });
      }

      // Return user data without password
      const userWithoutPassword = user[0];
      console.log('/me: Returning user data:', userWithoutPassword);
      return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    } catch (jwtError) {
      console.error('/me: JWT verification failed:', jwtError);
      // Invalid or expired token
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error('/me: Unexpected error:', error);
    // Return 500 for server errors
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
