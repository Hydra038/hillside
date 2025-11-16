import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Initialize Supabase database connection with error handling
const initializeDb = () => {
  try {
    console.log('Initializing Supabase (PostgreSQL) database connection...');
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined');
    }
    
    // Create postgres connection for Supabase
    const connection = postgres(dbUrl, {
      prepare: false, // Supabase doesn't support prepared statements over pooler
    });
    
    // Test the connection (this is non-blocking)
    connection`SELECT 1`.then(() => {
      console.log('Supabase database connection successful');
    }).catch(err => {
      console.error('Supabase database connection test failed:', err);
    });

    return drizzle(connection, { schema });
  } catch (error) {
    console.error('Failed to initialize Supabase database:', error);
    throw new Error('Supabase database initialization failed');
  }
};

export const db = initializeDb();
