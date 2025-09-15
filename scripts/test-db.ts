import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing MySQL database connection...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/\/\/.*:.*@/, '//<credentials>@'));
  
  try {
    // Create connection
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    console.log('Attempting to connect...');
    
    // Test query
    const [result] = await connection.execute('SELECT VERSION() as version');
    console.log('Connection successful!');
    console.log('MySQL version:', (result as any)[0].version);
    
    // Close connection
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testConnection();
