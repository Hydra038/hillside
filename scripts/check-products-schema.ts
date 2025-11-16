import { neon } from '@neondatabase/serverless';

async function checkProductsSchema() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  const sql = neon(process.env.DATABASE_URL);
  const columns = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'products'
    ORDER BY ordinal_position;
  `;
  console.log('Products table columns:', columns);
}

checkProductsSchema();
