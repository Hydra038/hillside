import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth-server';
import { db } from '@/lib/db/index';
import { activity } from '@/lib/db/schema.mysql';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ activities: [] }, { status: 401 });
  const activities = await db.select().from(activity).where(eq(activity.userId, user.id)).orderBy(desc(activity.createdAt)).limit(20);
  return NextResponse.json({ activities });
}
