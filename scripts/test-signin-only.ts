import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

// Test signin directly
async function testSignin() {
  console.log('🔐 Testing signin flow directly...');
  
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    
    // First, let's see what users exist
    console.log('📋 Checking existing users...');
    const users = await sql`SELECT id, name, email, role FROM users LIMIT 5`;
    console.log('Users in database:', users);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Try to sign in with an existing user
    const testUser = users[0];
    console.log(`🔍 Testing signin for user: ${testUser.email}`);
    
    // Get the full user data including password
    const fullUser = await sql`
      SELECT id, name, email, password, role 
      FROM users 
      WHERE email = ${testUser.email}
    `;
    
    if (fullUser.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📧 User found:', {
      id: fullUser[0].id,
      name: fullUser[0].name,
      email: fullUser[0].email,
      role: fullUser[0].role
    });
    
    // Test password verification with a known password
    const testPassword = 'password123'; // This is what we used in our test accounts
    console.log('🔑 Testing password verification...');
    
    const isValid = await bcrypt.compare(testPassword, fullUser[0].password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      console.log('❌ Password verification failed');
      console.log('Stored hash:', fullUser[0].password);
      console.log('Test password:', testPassword);
    } else {
      console.log('✅ Password verification successful!');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testSignin();
