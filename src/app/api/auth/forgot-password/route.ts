import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// In production, use a real email service and store tokens securely
const RESET_TOKEN_EXPIRY_MINUTES = 30;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    // Find user
    const userResults = await db.select().from(users).where(eq(users.email, email));
    if (!userResults.length) {
      // Always return success for privacy
      return NextResponse.json({ success: true });
    }
    const user = userResults[0];
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    // Store token and expiry in DB (add columns if needed)
    await db.update(users)
      .set({ reset_token: token, reset_token_expires: expires })
      .where(eq(users.id, user.id));
    // Send email (mock)
    console.log(`Password reset link for ${email}: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${token}`);
    // Always return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
