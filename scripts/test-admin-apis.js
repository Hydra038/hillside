const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testAdminAPIs() {
  console.log('\n🧪 Testing Admin APIs\n')
  console.log('=' .repeat(80))
  
  try {
    // Test 1: Orders
    console.log('\n📦 Testing Orders API...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
    
    if (ordersError) {
      console.log('⚠️  Orders error:', ordersError.message)
    } else {
      console.log(`✅ Orders found: ${orders?.length || 0}`)
    }
    
    // Test 2: Payment Settings
    console.log('\n💳 Testing Payment Settings API...')
    const { data: payments, error: paymentsError } = await supabase
      .from('payment_settings')
      .select('*')
    
    if (paymentsError) {
      console.log('❌ Payment Settings error:', paymentsError.message)
    } else {
      console.log(`✅ Payment methods found: ${payments?.length || 0}`)
      payments?.forEach(p => {
        console.log(`   - ${p.display_name} (${p.enabled ? 'Enabled' : 'Disabled'})`)
      })
    }
    
    // Test 3: Products
    console.log('\n📦 Testing Products API...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) {
      console.log('❌ Products error:', productsError.message)
    } else {
      console.log(`✅ Products found: ${products?.length || 0}`)
    }
    
    // Test 4: Users
    console.log('\n👥 Testing Users API...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
    
    if (usersError) {
      console.log('⚠️  Users error:', usersError.message)
    } else {
      console.log(`✅ Users found: ${users?.length || 0}`)
      const admins = users?.filter(u => u.role === 'admin')
      console.log(`   - Admins: ${admins?.length || 0}`)
    }
    
    console.log('\n' + '=' .repeat(80))
    console.log('\n✅ All API tests complete!\n')
    
  } catch (error) {
    console.error('\n❌ Test error:', error)
  }
}

testAdminAPIs()
