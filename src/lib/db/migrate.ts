import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Check if required environment variables are present
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('Initializing database connection...');
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  console.log('Starting migration process...');
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('Migrations complete!');

    // Create users table
    console.log('Creating users table...');
    try {
      // Create enum type
      await sql`
        DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('user', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
      `;

      // Create users table
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
      console.log('Users table created successfully!');
    } catch (error) {
      console.error('Error creating users table:', error);
    }

    // Insert sample data
    console.log('Inserting sample data...');
    await sql`
      INSERT INTO products (name, description, price, category, image_url, stock_quantity, weight, dimensions, moisture, season, features)
      VALUES 
        (
          'Premium Hardwood Logs',
          'High-quality, seasoned hardwood logs perfect for long-lasting heat.',
          120.00,
          'hardwood',
          '/images/products/hardwood-logs.jpg',
          100,
          25.00,
          '{"length": 25, "width": 10, "height": 10}',
          20.00,
          'all',
          '["Long burning time", "High heat output", "Low moisture content", "Minimal smoke"]'::jsonb
        ),
        (
          'Softwood Kindling',
          'Dry, easy-to-light kindling perfect for starting your fire.',
          45.00,
          'kindling',
          '/images/products/kindling.jpg',
          150,
          10.00,
          '{"length": 15, "width": 2, "height": 2}',
          15.00,
          'all',
          '["Easy to light", "Quick burning", "Perfect for starting fires", "Conveniently sized"]'::jsonb
        ),
        (
          'Mixed Hardwood Bundle',
          'A perfect mix of various hardwoods for diverse burning needs.',
          85.00,
          'mixed',
          '/images/products/mixed-bundle.jpg',
          75,
          20.00,
          '{"length": 20, "width": 8, "height": 8}',
          18.00,
          'all',
          '["Variety of woods", "Consistent quality", "Good value", "Versatile use"]'::jsonb
        );
    `;
    console.log('Sample data inserted!');

    // Verify the tables
    console.log('Checking database tables...');
    const tables = await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`;
    console.log('Tables in database:', tables);

    // Verify the data
    const products = await sql`SELECT * FROM products;`;
    console.log('Current products in database:', products);

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    // No need to end the connection with neon-http
  }
}

main();
