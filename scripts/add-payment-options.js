const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function addPaymentOptions() {
  console.log('\n💳 Adding payment options to database...\n')
  console.log('=' .repeat(80))
  
  const paymentOptions = [
    {
      type: 'cash',
      display_name: 'Cash on Delivery',
      description: 'Pay with cash when your firewood is delivered',
      enabled: true,
      config: {
        instructions: 'Please have exact change ready for the driver'
      }
    },
    {
      type: 'card',
      display_name: 'Credit/Debit Card',
      description: 'Pay securely with Visa, Mastercard, or American Express',
      enabled: true,
      config: {
        instructions: 'Card payment will be processed securely'
      }
    },
    {
      type: 'invoice',
      display_name: 'Invoice (Commercial)',
      description: 'Net 30 payment terms for approved commercial customers',
      enabled: true,
      config: {
        instructions: 'Invoice will be sent via email. Payment due within 30 days'
      }
    }
  ]
  
  for (const option of paymentOptions) {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .insert(option)
        .select()
      
      if (error) {
        console.log(`❌ Error adding ${option.display_name}:`, error.message)
      } else {
        console.log(`✅ Added: ${option.display_name}`)
      }
    } catch (err) {
      console.log(`❌ Error adding ${option.display_name}:`, err.message)
    }
  }
  
  console.log('\n' + '=' .repeat(80))
  console.log('\n✅ Payment options setup complete!')
  console.log('\n📊 Summary of all payment methods:')
  
  const { data: allMethods } = await supabase
    .from('payment_settings')
    .select('*')
    .order('id')
  
  if (allMethods) {
    allMethods.forEach((method, index) => {
      console.log(`   ${index + 1}. ${method.display_name} ${method.enabled ? '✓' : '✗'}`)
    })
  }
  
  console.log('')
}

addPaymentOptions()
