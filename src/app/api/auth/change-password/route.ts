import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth-server';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Fetch user from DB
  const dbUserArr = await db.select().from(users).where(eq(users.id, user.id));
  const dbUser = dbUserArr[0];
  if (!dbUser || !dbUser.password) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  // Check current password
  const valid = await bcrypt.compare(currentPassword, dbUser.password);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }
  // Hash new password
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));
  return NextResponse.json({ message: 'Password changed successfully' });
}
