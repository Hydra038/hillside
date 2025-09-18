const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test if we can connect
    await prisma.$connect()
    console.log('✅ Database connected!')
    
    // Test if we can fetch products
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        isFeatured: true
      }
    })
    
    console.log(`📦 Found ${products.length} products:`)
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (${product.category})`)
    })
    
    // Test featured products
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        price: true
      }
    })
    
    console.log(`⭐ Featured products: ${featuredProducts.length}`)
    featuredProducts.forEach(product => {
      console.log(`  ⭐ ${product.name}: $${product.price}`)
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
