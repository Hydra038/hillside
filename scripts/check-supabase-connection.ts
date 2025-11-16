import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...\n');
    
    // You'll need to add SUPABASE_URL and SUPABASE_ANON_KEY to your .env
    // For now, let's extract them from DATABASE_URL
    const dbUrl = process.env.DATABASE_URL || '';
    
    // Try to parse the connection string
    console.log('Connection string preview:', dbUrl.substring(0, 50) + '...\n');
    
    // Alternative: Use direct SQL query with proper connection
    const { Client } = await import('pg');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // Get tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Available tables:\n');
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    console.log('\n---\n');
    
    // Check products table
    const hasProducts = tablesResult.rows.find(r => r.table_name === 'products');
    
    if (hasProducts) {
      console.log('✅ Products table found! Checking columns...\n');
      
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'products'
        ORDER BY ordinal_position;
      `);
      
      console.log('Columns in products table:');
      columnsResult.rows.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name} (${col.data_type})`);
      });
      
      const hasFeatured = columnsResult.rows.find(c => c.column_name === 'is_featured');
      if (hasFeatured) {
        console.log('\n✅ is_featured column exists!');
      } else {
        console.log('\n⚠️  is_featured column NOT found.');
        console.log('\nRun this SQL in Supabase SQL Editor:');
        console.log('ALTER TABLE products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;');
      }
    } else {
      console.log('❌ Products table not found.');
    }
    
    await client.end();
    console.log('\n✅ Connection test complete!');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Make sure your password is correctly URL-encoded');
    console.log('3. Try using the Connection Pooler URL instead (Transaction mode)');
    console.log('4. Check if your IP is allowed in Supabase settings');
  }
}

checkSupabaseConnection();
