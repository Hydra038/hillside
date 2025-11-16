const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkPaymentOptions() {
  try {
    console.log('\n🔍 Checking for payment_settings table...\n')
    
    // Try to query payment_settings table
    const { data: paymentSettings, error: settingsError } = await supabase
      .from('payment_settings')
      .select('*')
    
    if (settingsError) {
      console.log('❌ Error accessing payment_settings table:', settingsError.message)
      console.log('\n📋 Available tables to check:')
      
      // Check if table exists by trying to query it
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables')
        .catch(() => null)
      
      console.log('\nℹ️  The payment_settings table may not exist yet.')
      console.log('   This is normal - it needs to be created.')
    } else {
      console.log('✅ Payment settings table found!\n')
      console.log('=' .repeat(80))
      
      if (paymentSettings && paymentSettings.length > 0) {
        paymentSettings.forEach((setting, index) => {
          console.log(`\n${index + 1}. ${setting.display_name || setting.displayName || setting.name}`)
          console.log(`   ID: ${setting.id}`)
          console.log(`   Type: ${setting.payment_type || setting.type || 'N/A'}`)
          console.log(`   Enabled: ${setting.enabled ? '✓ Yes' : '✗ No'}`)
          console.log(`   Details: ${setting.details || 'N/A'}`)
        })
      } else {
        console.log('\n⚠️  Payment settings table exists but is EMPTY')
        console.log('   No payment methods configured yet.')
      }
      
      console.log('\n' + '=' .repeat(80))
    }
    
    console.log('\n💡 Recommended payment options for UK firewood business:')
    console.log('   1. Cash on Delivery (COD)')
    console.log('   2. Bank Transfer / BACS')
    console.log('   3. Credit/Debit Card (Stripe/PayPal)')
    console.log('   4. Invoice (for commercial customers)\n')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkPaymentOptions()
