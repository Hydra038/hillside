import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema.mysql'
import { eq, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing verification token or email' },
        { status: 400 }
      )
    }

    // Find user with matching token and email
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        emailVerificationExpires: users.emailVerificationExpires
      })
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.emailVerificationToken, token)
        )
      )

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    const userData = user[0]

    // Check if already verified
    if (userData.emailVerified) {
      return NextResponse.json({
        message: 'Email already verified',
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          emailVerified: true
        }
      })
    }

    // Check if token has expired
    if (userData.emailVerificationExpires && new Date() > userData.emailVerificationExpires) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Update user as verified
    await db
      .update(users)
      .set({
        emailVerified: 1,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.email, email))

    console.log('Email verified successfully for user:', email)

    return NextResponse.json({
      message: 'Email verified successfully!',
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: true
      }
    })

  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified
      })
      .from(users)
      .where(eq(users.email, email))

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userData = user[0]

    if (userData.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const { randomUUID } = await import('crypto')
    const verificationToken = randomUUID()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Update user with new token
    await db
      .update(users)
      .set({
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        updatedAt: new Date()
      })
      .where(eq(users.email, email))

    // Send new verification email
    const { sendEmail, generateVerificationEmailHtml } = await import('@/lib/send-email')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`
    
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Hillside Logs Fuel',
      html: generateVerificationEmailHtml(userData.name, verificationLink),
      text: `Hi ${userData.name}! Please verify your email by clicking this link: ${verificationLink}`
    })

    return NextResponse.json({
      message: 'Verification email sent successfully!'
    })

  } catch (error) {
    console.error('Error resending verification email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
