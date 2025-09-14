export const runtime = "nodejs"
import { NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth-server';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';

export async function PUT(request: Request, context: any) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  // Update address JSON on the user
  await db.update(users).set({ address: data }).where(eq(users.id, user.id));
  return NextResponse.json({ address: data });
}

export async function DELETE(request: Request, context: any) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Remove address JSON from the user
  await db.update(users).set({ address: null }).where(eq(users.id, user.id));
  return NextResponse.json({ message: 'Address deleted' });
}
