import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 });
    }
    // Find user by reset token
    const userResults = await db.select().from(users).where(eq(users.resetToken, token));
    if (!userResults.length) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }
    const user = userResults[0];
    // Check expiry
    if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired.' }, { status: 400 });
    }
    // Hash new password
    const hashed = await bcrypt.hash(password, 10);
    // Update user password and clear reset token
    await db.update(users)
      .set({ password: hashed, resetToken: null, resetTokenExpires: null })
      .where(eq(users.id, user.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
