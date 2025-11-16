import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL!, {
  prepare: false,
});

async function checkTables() {
  try {
    console.log('Connecting to Supabase...\n');
    
    // Get all tables in public schema
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    console.log('📋 Available tables in your Supabase database:\n');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    
    console.log('\n---\n');
    
    // Check if products table exists and show its columns
    const productsTable = tables.find(t => t.table_name === 'products');
    
    if (productsTable) {
      console.log('✅ Products table found! Checking columns...\n');
      
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'products'
        ORDER BY ordinal_position;
      `;
      
      console.log('Columns in products table:');
      columns.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`);
      });
      
      // Check if is_featured exists
      const hasFeatured = columns.find(c => c.column_name === 'is_featured');
      if (hasFeatured) {
        console.log('\n✅ is_featured column exists!');
      } else {
        console.log('\n⚠️  is_featured column NOT found. You need to add it.');
      }
    } else {
      console.log('❌ Products table not found in database.');
    }
    
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
  } finally {
    await sql.end();
  }
}

checkTables();
