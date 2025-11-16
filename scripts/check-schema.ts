import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function checkSchema() {
  try {
    const result = await sql`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `
    console.log('Products table schema:')
    result.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkSchema()
