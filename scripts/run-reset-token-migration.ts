import { supabaseAdmin } from '../src/lib/supabase-admin'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'drizzle', '0006_add_reset_token_to_users.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('Running migration: 0006_add_reset_token_to_users.sql')
    console.log('SQL:', sql)

    // Execute the SQL - note: Supabase client doesn't support raw SQL directly
    // You'll need to run this in Supabase SQL editor or use a PostgreSQL client
    console.log('\n⚠️  Please run the following SQL in your Supabase SQL Editor:')
    console.log('\n' + sql + '\n')
    console.log('Or run it via psql/pgAdmin if you have direct database access.')

  } catch (error) {
    console.error('Migration error:', error)
  }
}

runMigration()
