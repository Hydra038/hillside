const { PrismaClient } = require('@prisma/client');

// Use direct connection for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function testConnection() {
  try {
    console.log('🔄 Testing database connection with direct URL...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected!');
    
    // Test if we can fetch products with explicit select
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        season: true, // Test the new season field
        isFeatured: true
      }
    });
    
    console.log(`📦 Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (Season: ${product.season || 'Not set'}) ${product.isFeatured ? '⭐' : ''}`);
    });
    
    // Test featured products count
    const featuredCount = await prisma.product.count({
      where: { isFeatured: true }
    });
    
    console.log(`⭐ Featured products: ${featuredCount}`);
    console.log('✅ All tests passed! Database is ready for deployment.');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();