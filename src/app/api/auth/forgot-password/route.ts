import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .single()

    // Always return success message for security (don't reveal if email exists)
    if (userError || !user) {
      return NextResponse.json({ 
        message: 'If an account exists with this email, you will receive password reset instructions.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token in database (you'll need to add these columns to users table)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry.toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error storing reset token:', updateError)
      return NextResponse.json(
        { error: 'Failed to process reset request' },
        { status: 500 }
      )
    }

    // In a real app, you would send an email here
    // Send email with reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    console.log('Password reset requested for:', email)
    console.log('Reset link:', resetLink)
    console.log('Token expires:', resetTokenExpiry)

    try {
      await sendPasswordResetEmail(email, resetToken)
      console.log('✅ Password reset email sent successfully to:', email)
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError)
      // Continue anyway - in production you might want to queue this for retry
    }

    return NextResponse.json({ 
      message: 'If an account exists with this email, you will receive password reset instructions.',
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
