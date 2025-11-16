import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

async function createUsersTable() {
  try {
    console.log('Creating users table if it doesn\'t exist...')
    
    // First create the enum type if it doesn't exist
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `)
    
    // Create users table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        address JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)
    
    console.log('Users table created successfully!')
    
    // Check if table exists and show current tables
    const tables = await db.execute(sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `)
    
    console.log('Current tables in database:', tables.rows || tables)
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating users table:', error)
    process.exit(1)
  }
}

createUsersTable()
