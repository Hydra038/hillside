import { db } from '@/lib/db';
import { contact_messages } from '@/lib/db/schema.mysql';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contact_messages)
      .orderBy(sql`${contact_messages.created_at} DESC`);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, reply_message } = await request.json();
    if (!id || !reply_message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await db.update(contact_messages)
      .set({ replied: 1, reply_message, replied_at: new Date() })
      .where(eq(contact_messages.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error replying to contact message:', error);
    return NextResponse.json({ error: 'Failed to reply to message' }, { status: 500 });
  }
}
