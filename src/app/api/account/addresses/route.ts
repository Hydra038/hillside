export const runtime = "nodejs"
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth-server';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ addresses: [] }, { status: 401 });
  // Address is stored as JSON on the user
  const dbUserArr = await db.select().from(users).where(eq(users.id, user.id));
  const dbUser = dbUserArr[0];
  const addresses = dbUser?.address ? [dbUser.address] : [];
  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  // Save address as JSON on the user
  await db.update(users).set({ address: data }).where(eq(users.id, user.id));
  return NextResponse.json({ address: data });
}
