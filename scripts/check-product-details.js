const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log(`\n✅ Found ${products.length} products:\n`)
    console.log('=' .repeat(80))
    
    // Show first product structure
    if (products.length > 0) {
      console.log('\n📋 Database columns available:')
      console.log(Object.keys(products[0]).join(', '))
      console.log('')
    }
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Price: £${product.price}`)
      console.log(`   Category: ${product.category}`)
      console.log(`   Stock: ${product.stock_quantity}`)
      console.log(`   Description: ${product.description?.substring(0, 60)}...`)
    })
    
    console.log('\n' + '=' .repeat(80))
    console.log('\n⚠️  ISSUES FOUND:')
    console.log('- Products missing weight/size/quantity information in name/description')
    console.log('- Need to add proper measurements for firewood:')
    console.log('  • Standard sizes: Small net (20-25kg), Large net (40kg), Bulk bags (250kg), Crates (1m³)')
    console.log('  • Kiln dried logs typically: £5-7 per net, £100-120 per bulk bag')
    console.log('  • Seasoned logs: £4-6 per net, £80-100 per bulk bag')
    console.log('- Current prices need review against UK market standards\n')

  } catch (error) {
    console.error('Error:', error)
  }
}

checkProducts()
