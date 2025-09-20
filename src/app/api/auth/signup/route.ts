import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('Signup API called')
    const { name, email, password } = await request.json()
    console.log('Signup data received:', { name, email, password: '***' })

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if user exists using Prisma
    console.log('Checking if user exists...')
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    console.log('Existing user check result:', existingUser);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using Prisma
    console.log('Creating new user...')
    const userId = randomUUID();
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    console.log('User created successfully:', { id: userId, name, email });
    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
        role: 'USER'
      },
      message: 'Account created successfully! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
