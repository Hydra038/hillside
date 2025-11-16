const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testValidStatuses() {
  console.log('\n🧪 Testing Valid Order Status Values\n')
  console.log('=' .repeat(80))
  
  const statuses = ['PENDING', 'pending', 'Pending', 'PROCESSING', 'processing', 'Processing']
  
  for (const status of statuses) {
    console.log(`\nTrying status: "${status}"`)
    
    const { error } = await supabase
      .from('orders')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        total: '100',
        shipping_address: { test: 'test' },
        payment_method: 'bank_transfer',
        status: status
      })
      .select()
    
    if (error) {
      console.log('  ❌ Failed:', error.message)
    } else {
      console.log('  ✅ SUCCESS! This status value works!')
      
      // Clean up - delete the test order
      await supabase
        .from('orders')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000000')
      
      break
    }
  }
  
  console.log('\n' + '=' .repeat(80))
}

testValidStatuses()
