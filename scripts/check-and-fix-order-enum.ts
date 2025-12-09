import { supabaseAdmin } from '../src/lib/supabase-admin'

async function checkAndFixOrderEnum() {
  try {
    console.log('Checking order_status enum...')
    
    // Query to check if enum exists and its values
    const { data: enumData, error: enumError } = await supabaseAdmin
      .rpc('check_enum', { 
        enum_name: 'order_status' 
      })
      .single()

    if (enumError) {
      console.log('Could not check enum directly, trying alternative method...')
    }

    // Try to create a test order to see the actual error
    console.log('\nAttempting to create a test order...')
    const { data: testOrder, error: createError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // dummy ID
        total: '10.00',
        shipping_address: 'Test Address',
        payment_method: 'test',
        status: 'pending'
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating test order:', createError)
      console.log('\n📋 Error details:', JSON.stringify(createError, null, 2))
      
      if (createError.message.includes('enum')) {
        console.log('\n⚠️  ENUM ISSUE DETECTED!')
        console.log('The order_status enum might not exist or has wrong values.')
        console.log('\nTo fix this, run the following SQL in Supabase SQL Editor:')
        console.log('-------------------------------------------------------')
        console.log(`
-- Drop existing enum if it exists
DROP TYPE IF EXISTS order_status CASCADE;

-- Create the enum with correct values
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Update the orders table to use the enum
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status 
  USING status::order_status;
        `)
        console.log('-------------------------------------------------------')
      }
    } else {
      console.log('✅ Test order created successfully!')
      console.log('Order ID:', testOrder?.id)
      
      // Clean up test order
      if (testOrder?.id) {
        await supabaseAdmin
          .from('orders')
          .delete()
          .eq('id', testOrder.id)
        console.log('✅ Test order cleaned up')
      }
    }

    // Check the current column type
    console.log('\n📊 Checking orders table structure...')
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .limit(0)

    if (tableError) {
      console.error('Error checking table:', tableError)
    }

    // Try to get existing orders
    const { data: existingOrders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .limit(5)

    if (fetchError) {
      console.error('Error fetching orders:', fetchError)
    } else {
      console.log('\n📦 Existing orders:')
      console.log(existingOrders)
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

checkAndFixOrderEnum()
