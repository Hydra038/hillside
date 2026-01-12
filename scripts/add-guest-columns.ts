import { supabaseAdmin } from '../src/lib/supabase-admin'

async function addGuestColumns() {
  try {
    console.log('Adding guest checkout columns to orders table...')

    // Check if columns already exist
    const { data: existingColumns, error: checkError } = await supabaseAdmin
      .from('orders')
      .select('guest_name, guest_email, guest_phone')
      .limit(1)

    if (!checkError) {
      console.log('Guest columns already exist!')
      return
    }

    // Add guest columns using raw SQL
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS guest_name TEXT,
        ADD COLUMN IF NOT EXISTS guest_email TEXT,
        ADD COLUMN IF NOT EXISTS guest_phone TEXT;
        
        -- Make user_id nullable for guest orders
        ALTER TABLE orders 
        ALTER COLUMN user_id DROP NOT NULL;
        
        -- Add constraint to ensure either user_id or guest_email is present
        ALTER TABLE orders
        ADD CONSTRAINT orders_user_or_guest_check 
        CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);
      `
    })

    if (error) {
      console.error('Error adding columns:', error)
      console.log('\nPlease run this SQL manually in Supabase SQL Editor:')
      console.log(`
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS guest_name TEXT,
        ADD COLUMN IF NOT EXISTS guest_email TEXT,
        ADD COLUMN IF NOT EXISTS guest_phone TEXT;
        
        ALTER TABLE orders 
        ALTER COLUMN user_id DROP NOT NULL;
        
        ALTER TABLE orders
        ADD CONSTRAINT orders_user_or_guest_check 
        CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);
      `)
    } else {
      console.log('✅ Guest columns added successfully!')
    }
  } catch (error) {
    console.error('Error:', error)
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:')
    console.log(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS guest_name TEXT,
      ADD COLUMN IF NOT EXISTS guest_email TEXT,
      ADD COLUMN IF NOT EXISTS guest_phone TEXT;
      
      ALTER TABLE orders 
      ALTER COLUMN user_id DROP NOT NULL;
      
      ALTER TABLE orders
      ADD CONSTRAINT orders_user_or_guest_check 
      CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);
    `)
  }
}

addGuestColumns()
