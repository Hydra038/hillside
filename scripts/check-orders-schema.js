const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkOrdersSchema() {
  console.log('\n📊 Checking Orders Table Schema\n')
  console.log('=' .repeat(80))
  
  try {
    // Try to get the table structure by attempting to insert with invalid data
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    console.log('\n✅ Orders table exists')
    
    if (data && data.length > 0) {
      console.log('\nSample order structure:')
      console.log(JSON.stringify(data[0], null, 2))
    } else {
      console.log('\n⚠️  No orders in database yet')
    }
    
    // Try to create a test order to see the error
    console.log('\n\n🧪 Testing order creation to see valid status values...\n')
    
    const { error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        total: '100',
        shipping_address: { test: 'test' },
        payment_method: 'bank_transfer',
        status: 'pending'
      })
      .select()
    
    if (insertError) {
      console.log('Error message:', insertError.message)
      console.log('Error details:', insertError.details)
      console.log('Error hint:', insertError.hint)
      
      // Try to extract valid enum values from error message
      if (insertError.message.includes('enum')) {
        console.log('\n💡 The status field uses an ENUM type.')
        console.log('   Valid values might be in the error message above.')
      }
    }
    
    console.log('\n' + '=' .repeat(80))
    
  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

checkOrdersSchema()
