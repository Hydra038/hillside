const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkAndCreateTables() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log('🔍 Checking database tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Available tables:', tables.map(t => t.table_name));
    
    // Check if users table exists
    const userTableExists = tables.some(t => t.table_name === 'users');
    console.log('👤 Users table exists:', userTableExists);
    
    if (!userTableExists) {
      console.log('🔨 Creating users table...');
      await sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists!');
    }
    
    // Check if products table exists
    const productTableExists = tables.some(t => t.table_name === 'products');
    console.log('🛍️ Products table exists:', productTableExists);
    
    if (!productTableExists) {
      console.log('🔨 Creating products table...');
      await sql`
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          image_url VARCHAR(500),
          category VARCHAR(100),
          stock_quantity INTEGER DEFAULT 0,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Products table created successfully!');
    } else {
      console.log('✅ Products table already exists!');
    }
    
    // Re-check tables after creation
    console.log('\n📋 Final table list:');
    const finalTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(finalTables.map(t => `  - ${t.table_name}`).join('\n'));
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkAndCreateTables();
