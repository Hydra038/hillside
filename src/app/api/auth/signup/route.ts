import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'
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

    // Check if user exists using drizzle ORM
    console.log('Checking if user exists...')
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));
    console.log('Existing user check result:', existingUser);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using drizzle ORM
    console.log('Creating new user...')
    const userId = randomUUID();
    const now = new Date();
    await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: now,
      updatedAt: now
    });
    console.log('User created successfully:', { id: userId, name, email });
    return NextResponse.json({
      user: {
        id: userId,
        name,
        email
      }
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
