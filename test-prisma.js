require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testPrismaConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing Prisma connection...');
    
    // Test products query
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      take: 3,
      select: {
        id: true,
        name: true,
        price: true,
        isFeatured: true
      }
    });
    console.log('✅ Prisma connection successful!');
    console.log('📦 Featured products found:', products.length);
    
    if (products.length > 0) {
      console.log('🌳 Sample product:', products[0].name);
      console.log('💰 Price:', products[0].price.toString());
    }
    
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();