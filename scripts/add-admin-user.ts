import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema.mysql';
import bcrypt from 'bcryptjs';

async function addAdminUser() {
  const name = 'admin';
  const email = 'support@firewoodlogsfuel.com';
  const password = 'Derq@038!';
  const role = 'admin';

  // Check if user already exists
  // Use drizzle-orm eq for where clause
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { eq } = require('drizzle-orm');
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    console.log('User already exists:', existing[0]);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date();
  await db.insert(users).values({
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: now,
    updatedAt: now
  });
  console.log('Admin user created:', { name, email, role });
}

addAdminUser();
