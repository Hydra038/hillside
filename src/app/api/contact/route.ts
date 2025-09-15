import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contact_messages } from '@/lib/db/schema.mysql';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const [inserted] = await db.insert(contact_messages).values({
      name,
      email,
      subject,
      message,
    });
    return NextResponse.json({ success: true, id: inserted.insertId });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
