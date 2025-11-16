const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function setupPaymentMethods() {
  console.log('\n💳 Setting up Payment Methods (Bank Transfer & PayPal only)...\n')
  console.log('=' .repeat(80))
  
  try {
    // Step 1: Delete old payment methods (cash, card, invoice)
    console.log('\n🗑️  Removing old payment methods...')
    const { error: deleteError } = await supabase
      .from('payment_settings')
      .delete()
      .in('type', ['cash', 'card', 'invoice'])
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 means no rows found, which is OK
      console.log('⚠️  Note:', deleteError.message)
    } else {
      console.log('✅ Old payment methods removed')
    }
    
    // Step 2: Check if PayPal exists
    const { data: existingPaypal } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('type', 'paypal')
      .single()
    
    // Step 3: Add or update PayPal Friends & Family
    if (!existingPaypal) {
      console.log('\n➕ Adding PayPal Friends & Family...')
      const { error: paypalError } = await supabase
        .from('payment_settings')
        .insert({
          type: 'paypal',
          display_name: 'PayPal (Friends & Family)',
          description: 'Send payment via PayPal Friends & Family - No fees',
          enabled: true,
          config: {
            email: 'your-paypal@email.com',
            instructions: 'Please send payment as Friends & Family to avoid fees. Include your order number in the payment notes.'
          }
        })
      
      if (paypalError) {
        console.log('❌ Error adding PayPal:', paypalError.message)
      } else {
        console.log('✅ PayPal Friends & Family added')
      }
    } else {
      console.log('\n✅ PayPal already exists')
    }
    
    // Step 4: Verify Bank Transfer exists and update it
    const { data: existingBank } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('type', 'bank_transfer')
      .single()
    
    if (existingBank) {
      console.log('\n✅ Bank Transfer already configured')
    } else {
      console.log('\n⚠️  Bank Transfer not found - please add it manually')
    }
    
    // Step 5: Display final configuration
    console.log('\n' + '=' .repeat(80))
    console.log('\n📊 Final Payment Methods Configuration:\n')
    
    const { data: allMethods } = await supabase
      .from('payment_settings')
      .select('*')
      .order('id')
    
    if (allMethods) {
      allMethods.forEach((method, index) => {
        console.log(`${index + 1}. ${method.display_name}`)
        console.log(`   Type: ${method.type}`)
        console.log(`   Status: ${method.enabled ? '✓ Enabled' : '✗ Disabled'}`)
        console.log(`   Description: ${method.description}`)
        
        if (method.type === 'bank_transfer' && method.config) {
          console.log(`   Account: ${method.config.accountName || 'N/A'}`)
          console.log(`   Sort Code: ${method.config.sortCode || 'N/A'}`)
          console.log(`   Account Number: ${method.config.accountNumber || 'N/A'}`)
        }
        
        if (method.type === 'paypal' && method.config) {
          console.log(`   PayPal Email: ${method.config.email || 'NOT SET - PLEASE UPDATE!'}`)
        }
        console.log('')
      })
    }
    
    console.log('=' .repeat(80))
    console.log('\n✅ Setup Complete!\n')
    console.log('📝 Next Steps:')
    console.log('   1. Update PayPal email in admin panel')
    console.log('   2. Run the SQL in Supabase if needed')
    console.log('   3. Test checkout with both payment methods\n')
    
  } catch (error) {
    console.error('\n❌ Error:', error)
  }
}

setupPaymentMethods()
