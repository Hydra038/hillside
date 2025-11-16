import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: Request) {
  try {
    // Validate environment
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    console.log('JWT_SECRET present:', true);
    
    // Validate request body
    if (!request.body) {
      console.error('Request body is missing');
      return NextResponse.json(
        { error: 'Request body is missing' },
        { status: 400 }
      );
    }

    const { email, password } = await request.json();
    console.log('Login attempt for email:', email)

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user using Supabase client
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, password, role, created_at')
      .eq('email', email)
      .single()
    
    console.log('User found:', !!user)
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    // Create the response object
    const response = NextResponse.json({
      user: userWithoutPassword,
      success: true
    });

    // Set secure cookie with specific domain
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    // Log the response headers for debugging
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Cookie being set:', token);

    return response;

  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
