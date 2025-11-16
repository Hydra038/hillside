import { db } from '../src/lib/db.ts'
import { products } from '../src/lib/db/schema.ts'

async function listProducts() {
  try {
    console.log('Fetching all products from database...')
    
    const allProducts = await db.select().from(products)
    
    if (allProducts.length === 0) {
      console.log('❌ No products found in database!')
      return
    }
    
    console.log(`✅ Found ${allProducts.length} products:`)
    console.log('=====================================')
    
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Price: £${Number(product.price).toFixed(2)}`)
      console.log(`   Description: ${product.description?.substring(0, 100)}${product.description?.length > 100 ? '...' : ''}`)
      console.log(`   Stock: ${product.stockQuantity}`)
      console.log(`   Weight: ${product.weight}kg`)
      console.log(`   ID: ${product.id}`)
      console.log('   ---')
    })
    
  } catch (error) {
    console.error('❌ Error fetching products:', error)
  }
}

listProducts()
