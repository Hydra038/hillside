import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function testSignin() {
  try {
    console.log('Testing signin functionality...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Test with the user we just created
    const email = 'testnew@example.com';
    const password = 'password123';
    
    console.log('Testing database connection...');
    const testQuery = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', testQuery);

    console.log('Finding user by email...');
    const existingUser = await sql`
      SELECT id, name, email, password, role, created_at, updated_at
      FROM users 
      WHERE email = ${email}
    `;
    
    if (existingUser.length === 0) {
      throw new Error('User not found');
    }

    const user = existingUser[0];
    console.log('User found:', { id: user.id, name: user.name, email: user.email, role: user.role });

    console.log('Verifying password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password verification successful:', isValid);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('JWT token generated successfully, length:', token.length);

    // Test token verification
    console.log('Testing token verification...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    console.log('Token verified successfully:', { userId: decoded.userId, email: decoded.email, role: decoded.role });

    // Test /me endpoint functionality
    console.log('Testing /me endpoint logic...');
    const meUser = await sql`
      SELECT id, name, email, role, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId}
    `;

    if (meUser.length === 0) {
      throw new Error('User not found for /me endpoint');
    }

    console.log('/me endpoint would return:', meUser[0]);
    console.log('✅ All signin functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Signin test failed:', error);
  }
}

testSignin();
