import { supabaseAdmin } from '../src/lib/supabase-admin'

async function addResetTokenColumns() {
  try {
    console.log('Adding reset_token columns to users table...')
    
    // Add columns using raw SQL
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS reset_token TEXT,
        ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
        
        CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
      `
    })

    if (error) {
      console.error('Error running migration:', error)
      console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:')
      console.log(`
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
      `)
      return
    }

    console.log('✅ Migration completed successfully!')
    
    // Verify columns were added
    const { data: testData, error: testError } = await supabaseAdmin
      .from('users')
      .select('reset_token, reset_token_expiry')
      .limit(1)

    if (testError) {
      console.error('Error verifying columns:', testError)
    } else {
      console.log('✅ Columns verified successfully!')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

addResetTokenColumns()
