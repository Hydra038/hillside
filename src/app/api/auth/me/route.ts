
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema.mysql';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    console.error("/api/auth/me: No token provided");
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch (err) {
    console.error("/api/auth/me: Token verification failed", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (!decoded || !decoded.userId) {
    console.error("/api/auth/me: Decoded token missing userId", decoded);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  let userResults;
  try {
    userResults = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, decoded.userId));
  } catch (err) {
    console.error("/api/auth/me: DB query failed", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
  if (!userResults || userResults.length === 0) {
    console.error("/api/auth/me: User not found for id", decoded.userId);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const userWithoutPassword = userResults[0];
  return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
}
