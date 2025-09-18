import { prisma } from '../src/lib/prisma'

async function initializeDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Test the connection
    const result = await prisma.$executeRaw`SELECT 1 + 1 AS result`
    console.log('Database connection successful!')
    
    // Count existing tables
    const userCount = await prisma.users.count()
    const productCount = await prisma.products.count()
    
    console.log(`Found ${userCount} users and ${productCount} products`)
    
    if (productCount === 0) {
      console.log('Creating sample products...')
      
      // Create sample products
      await prisma.products.createMany({
        data: [
          {
            name: 'Premium Birch Firewood',
            description: 'High-quality seasoned birch logs perfect for winter heating',
            price: 89.99,
            category: 'Hardwood',
            image_url: '/images/birch-logs.jpg',
            stock_quantity: 50,
            season: 'All Year',
            features: ['Well Seasoned', 'Burns Clean', 'Long Lasting'],
            is_featured: true
          },
          {
            name: 'Oak Mixed Hardwood',
            description: 'Premium mixed hardwood including oak, ash, and beech',
            price: 99.99,
            category: 'Hardwood',
            image_url: '/images/mixed-hardwood.jpg',
            stock_quantity: 30,
            season: 'All Year',
            features: ['Mixed Species', 'High Heat Output', 'Long Burn Time'],
            is_featured: true
          }
        ]
      })
      
      console.log('Sample products created!')
    }
    
    console.log('Database initialization complete!')
    
  } catch (error) {
    console.error('Database initialization failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initializeDatabase()
