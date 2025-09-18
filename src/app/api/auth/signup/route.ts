import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { sendEmail, generateVerificationEmailHtml } from '@/lib/send-email'

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

    // Generate email verification token
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user using Prisma
    console.log('Creating new user...')
    const userId = randomUUID();
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Hillside Logs Fuel',
        html: generateVerificationEmailHtml(name, verificationLink),
        text: `Hi ${name}! Please verify your email by clicking this link: ${verificationLink}`
      });
      console.log('Verification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails - user can resend later
    }

    console.log('User created successfully:', { id: userId, name, email });
    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
        emailVerified: false
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
