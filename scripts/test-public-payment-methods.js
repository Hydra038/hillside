const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testPaymentMethods() {
  console.log('\n💳 Testing Public Payment Methods API\n')
  console.log('=' .repeat(80))
  
  try {
    // Simulate what the checkout page does
    const { data: payments, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('enabled', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.log('❌ Error:', error.message)
      return
    }
    
    console.log(`\n✅ Found ${payments.length} enabled payment method(s):\n`)
    
    payments.forEach((method, index) => {
      console.log(`${index + 1}. ${method.display_name}`)
      console.log(`   Type: ${method.type}`)
      console.log(`   Description: ${method.description}`)
      console.log(`   ID: ${method.id}`)
      
      if (method.config) {
        console.log(`   Config:`)
        if (method.type === 'bank_transfer') {
          console.log(`      Account Name: ${method.config.accountName || 'N/A'}`)
          console.log(`      Sort Code: ${method.config.sortCode || 'N/A'}`)
          console.log(`      Account Number: ${method.config.accountNumber || 'N/A'}`)
        } else if (method.type === 'paypal') {
          console.log(`      PayPal Email: ${method.config.email || 'N/A'}`)
          console.log(`      Instructions: ${method.config.instructions || 'N/A'}`)
        }
      }
      console.log('')
    })
    
    console.log('=' .repeat(80))
    console.log('\n✅ Checkout page should display these payment options!\n')
    
  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

testPaymentMethods()
