import { prisma } from '../src/lib/prisma'

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection to Railway MySQL...')
    console.log('Host: interchange.proxy.rlwy.net:47475')
    console.log('Database: railway')
    console.log('User: root')
    
    // Test basic connection
    const result = await prisma.$executeRaw`SELECT 1 as test`
    console.log('✅ Database connection successful!')
    console.log('Test query result:', result)
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'railway'
    `
    console.log('📋 Existing tables:', tables)
    
    // If no tables, push schema
    if (!Array.isArray(tables) || tables.length === 0) {
      console.log('🔄 No tables found, schema needs to be applied')
      console.log('Run: npx prisma db push')
    } else {
      console.log('✅ Database schema appears to be set up')
      
      // Count records in main tables
      try {
        const userCount = await prisma.user.count()
        const productCount = await prisma.product.count()
        console.log(`📊 Found ${userCount} users and ${productCount} products`)
      } catch (error) {
        console.log('⚠️ Tables exist but may need migration:', error)
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.log('\n💡 Troubleshooting tips:')
    console.log('1. Check if Railway database is running')
    console.log('2. Verify DATABASE_URL in .env file')
    console.log('3. Check firewall/network connectivity')
    console.log('4. Try connecting directly with MySQL client')
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()
