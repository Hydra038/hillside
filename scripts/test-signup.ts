import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

async function testSignup() {
  try {
    console.log('Testing signup functionality...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Test data
    const name = 'Test User New';
    const email = 'testnew@example.com';
    const password = 'password123';
    
    console.log('Testing database connection...');
    const testQuery = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', testQuery);

    console.log('Checking available tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Available tables:', tables.map(t => t.table_name));

    console.log('Checking if user exists...');
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    
    if (existingUser.length > 0) {
      console.log('User already exists, deleting first...');
      await sql`DELETE FROM users WHERE email = ${email}`;
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new user...');
    const newUser = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, 'user')
      RETURNING id, name, email, role
    `;

    console.log('User created successfully:', newUser[0]);
    
    // Test login
    console.log('Testing password verification...');
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification successful:', isValid);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSignup();
