const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSeasonColumn() {
  try {
    console.log('Adding season column to products table...');
    
    // Check if season column already exists
    const columnExists = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'season'
    `;
    
    if (columnExists.length === 0) {
      // Add season column
      await prisma.$executeRaw`
        ALTER TABLE "products" ADD COLUMN "season" VARCHAR(50)
      `;
      console.log('✅ Season column added successfully!');
    } else {
      console.log('✅ Season column already exists!');
    }
    
    // Verify the column was added
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;
    
    console.log('Updated products table columns:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addSeasonColumn();