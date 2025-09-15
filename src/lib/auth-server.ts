import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from './db/index';
import { users } from './db/schema.mysql';
import { eq } from 'drizzle-orm';

function getJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return JWT_SECRET;
}

export async function getUserFromSession() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  if (!token) return null;
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded &&
      'role' in decoded
    ) {
      const { userId } = decoded as { userId: string };
      const userResults = await db.select().from(users).where(eq(users.id, userId));
      return userResults[0] || null;
    }
    return null;
  } catch {
    return null;
  }
}
