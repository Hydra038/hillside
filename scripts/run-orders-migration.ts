import { db } from '../src/lib/db'
import { sql } from 'drizzle-orm'
import * as fs from 'fs'
import * as path from 'path'

async function runOrdersMigration() {
  try {
    console.log('Running orders tables migration...')
    
    // Create enum first
    console.log('Creating order_status enum...')
    await db.execute(sql`
      DO $$ BEGIN
          CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
      EXCEPTION
          WHEN duplicate_object THEN null;
      END $$;
    `)
    
    // Create orders table
    console.log('Creating orders table...')
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id),
          status order_status NOT NULL DEFAULT 'pending',
          total NUMERIC NOT NULL,
          shipping_address JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)
    
    // Create order_items table
    console.log('Creating order_items table...')
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id),
          product_id INTEGER NOT NULL REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price_at_time NUMERIC NOT NULL
      )
    `)
    
    console.log('Orders tables migration completed successfully!')
    
    // Test the tables
    console.log('Testing table creation...')
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('orders', 'order_items')
      ORDER BY table_name
    `)
    
    console.log('Orders tables created:', result.rows)
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

runOrdersMigration()
