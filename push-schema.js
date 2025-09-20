const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function pushSchema() {
    try {
        // Connect using the same URL from your config
        const DATABASE_URL = 'postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres';
        const sql = postgres(DATABASE_URL);

        console.log('Creating enums and tables...');

        // Create the enums first
        await sql`CREATE TYPE IF NOT EXISTS user_role AS ENUM ('user', 'admin');`;
        console.log('✓ user_role enum created');

        await sql`CREATE TYPE IF NOT EXISTS order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');`;
        console.log('✓ order_status enum created');

        // Now create the tables (simplified version)
        await sql`
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
    `;
        console.log('✓ users table created');

        await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        season TEXT,
        features JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
        console.log('✓ products table created');

        await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        status order_status NOT NULL DEFAULT 'pending',
        total NUMERIC NOT NULL,
        shipping_address JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
        console.log('✓ orders table created');

        await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id UUID NOT NULL REFERENCES orders(id),
        product_id INTEGER NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price_at_time NUMERIC NOT NULL
      );
    `;
        console.log('✓ order_items table created');

        await sql`
      CREATE TABLE IF NOT EXISTS activity (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
        console.log('✓ activity table created');

        await sql`
      CREATE TABLE IF NOT EXISTS payment_settings (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT,
        enabled BOOLEAN NOT NULL DEFAULT true,
        config JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
        console.log('✓ payment_settings table created');

        await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
        console.log('✓ contact_messages table created');

        // Enable RLS for contact_messages
        await sql`ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;`;
        await sql`
      CREATE POLICY IF NOT EXISTS "Allow public inserts on contact_messages" 
      ON contact_messages FOR INSERT 
      WITH CHECK (true);
    `;
        console.log('✓ RLS enabled for contact_messages');

        await sql.end();
        console.log('\n🎉 Database schema pushed successfully!');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

pushSchema();