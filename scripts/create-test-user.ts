import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  // Get args from command line
  const args = process.argv.slice(2);
  let email = 'test@example.com';
  let password = 'password123';
  let role = 'user';
  let name = 'Test User';
  args.forEach((arg, i) => {
    if (arg === '--email' && args[i+1]) email = args[i+1];
    if (arg === '--password' && args[i+1]) password = args[i+1];
    if (arg === '--role' && args[i+1]) role = args[i+1];
    if (arg === '--name' && args[i+1]) name = args[i+1];
  });
  console.log(`Creating user: ${email}, role: ${role}`);
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      console.log('User already exists!');
      return;
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
      RETURNING id, name, email, role
    `;
    console.log('User created successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User data:', result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

createTestUser();
