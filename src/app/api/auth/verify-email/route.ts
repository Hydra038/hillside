import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        emailVerificationToken: token
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        emailVerificationExpires: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email already verified',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: true
        }
      })
    }

    // Check if token has expired
    if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Update user as verified
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    console.log('Email verified successfully for user:', email)

    return NextResponse.json({
      message: 'Email verified successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
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
    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires
      }
    });

    // Send new verification email
    const { sendEmail, generateVerificationEmailHtml } = await import('@/lib/send-email')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`
    
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Hillside Logs Fuel',
      html: generateVerificationEmailHtml(user.name, verificationLink),
      text: `Hi ${user.name}! Please verify your email by clicking this link: ${verificationLink}`
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
