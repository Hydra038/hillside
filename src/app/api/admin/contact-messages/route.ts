import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({ error: 'Unable to load messages' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, reply_message } = await request.json();
    if (!id || !reply_message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: {
        replied: true,
        // Note: reply_message and replied_at fields may need to be added to the schema
        // For now, just update replied status
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error replying to contact message:', error);
    return NextResponse.json({ error: 'Unable to reply to message' }, { status: 500 });
  }
}
