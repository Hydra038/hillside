const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check products table columns
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    
    console.log('Products table columns:', result);
    
    // Check if season column exists
    const seasonCheck = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'season'
    `;
    
    console.log('Season column exists:', seasonCheck.length > 0 ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();