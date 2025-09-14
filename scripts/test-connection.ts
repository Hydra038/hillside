import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic connection
    console.log('Testing basic connection...');
    const result = await sql`SELECT 1 as test`;
    console.log('Connection test result:', result);
    
    // Check what tables exist
    console.log('Checking tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log('Tables found:', tables);
    
    // Specifically check for users table
    console.log('Checking for users table...');
    const usersTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    console.log('Users table exists:', usersTableCheck);
    
    // If users table exists, try to query it
    if (usersTableCheck[0]?.exists) {
      console.log('Trying to query users table...');
      const userCount = await sql`SELECT COUNT(*) FROM users`;
      console.log('User count:', userCount);
    }
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
