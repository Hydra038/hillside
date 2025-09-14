import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/\/\/.*:.*@/, '//<credentials>@'));
  
  try {
    const sql = neon(process.env.DATABASE_URL!);
    console.log('Attempting to connect...');
    const result = await sql`SELECT version();`;
    console.log('Connection successful!');
    console.log('PostgreSQL version:', result[0].version);
  } catch (error) {
    console.error('Connection failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testConnection();
