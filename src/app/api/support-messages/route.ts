import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { support_messages, users } from '@/lib/db/schema.mysql';
import { eq, and } from 'drizzle-orm/sql/expressions/conditions';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Get all messages for a user (user or admin)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  const messages = await db
    .select()
    .from(support_messages)
    .where(eq(support_messages.user_id, userId))
    .orderBy(support_messages.created_at);
  return NextResponse.json(messages);
}

// Post a new message (user or admin)
export async function POST(request: Request) {
  // Require authentication for user messages
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token || !process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; role: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { user_id, sender, message } = await request.json();
  if (!user_id || !sender || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Only allow user to send as themselves, or admin to send as admin
  if (sender === 'user' && decoded.userId !== user_id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }
  await db.insert(support_messages).values({ user_id, sender, message });
  return NextResponse.json({ success: true });
}
