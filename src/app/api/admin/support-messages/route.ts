import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { support_messages, users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm/sql/expressions/conditions';

export async function GET() {
  // Return all support messages for all users, joined with user details
  const messages = await db
    .select({
      id: support_messages.id,
      user_id: support_messages.user_id,
      sender: support_messages.sender,
      message: support_messages.message,
      created_at: support_messages.created_at,
      name: users.name,
      email: users.email,
    })
    .from(support_messages)
  .leftJoin(users, eq(users.id, support_messages.user_id))
    .orderBy(support_messages.user_id, support_messages.created_at);
  return NextResponse.json(messages);
}
