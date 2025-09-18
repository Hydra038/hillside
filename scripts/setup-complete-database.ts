import { prisma } from '../src/lib/prisma'

async function setupDatabase() {
  console.log('🚀 Starting database setup...')
  
  try {
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$executeRaw`SELECT 1`
    console.log('✅ Database connection successful!')
    
    // Apply schema
    console.log('📋 Checking database schema...')
    
    // Check if users table exists
    try {
      const userCount = await prisma.user.count()
      console.log(`👥 Users table exists with ${userCount} records`)
    } catch (error) {
      console.log('⚠️ Users table needs to be created')
      console.log('Run: npx prisma db push')
      return
    }
    
    // Check other tables
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()
    
    console.log(`📦 Products: ${productCount}`)
    console.log(`🛒 Orders: ${orderCount}`)
    
    // Create sample data if empty
    if (productCount === 0) {
      console.log('🌱 Creating sample products...')
      
      await prisma.product.createMany({
        data: [
          {
            name: 'Premium Seasoned Oak',
            description: 'High-quality seasoned oak logs, perfect for long-burning fires with excellent heat output.',
            price: 120.00,
            category: 'Hardwood',
            imageUrl: '/images/oak-logs.jpg',
            stockQuantity: 25,
            season: 'All Year',
            features: ['Well Seasoned', 'High Heat Output', 'Long Burning', 'Premium Quality'],
            isFeatured: true
          },
          {
            name: 'Mixed Hardwood Bundle',
            description: 'A premium mix of oak, ash, and beech logs - ideal for consistent heating.',
            price: 95.00,
            category: 'Hardwood',
            imageUrl: '/images/mixed-hardwood.jpg',
            stockQuantity: 40,
            season: 'All Year',
            features: ['Mixed Species', 'Consistent Burn', 'Great Value', 'Ready to Burn'],
            isFeatured: true
          },
          {
            name: 'Birch Firewood',
            description: 'Beautiful white birch logs that burn cleanly with a pleasant aroma.',
            price: 85.00,
            category: 'Hardwood',
            imageUrl: '/images/birch-logs.jpg',
            stockQuantity: 35,
            season: 'All Year',
            features: ['Clean Burning', 'Pleasant Aroma', 'Quick Lighting', 'Attractive Bark'],
            isFeatured: false
          },
          {
            name: 'Kindling Bundle',
            description: 'Dry kindling wood perfect for starting fires - essential for every fire starter.',
            price: 15.00,
            category: 'Kindling',
            imageUrl: '/images/kindling.jpg',
            stockQuantity: 100,
            season: 'All Year',
            features: ['Bone Dry', 'Quick Lighting', 'Essential for Fire Starting', 'Convenient Bundle'],
            isFeatured: false
          },
          {
            name: 'Premium Firelighters',
            description: 'Natural wood wool firelighters - eco-friendly and efficient fire starting.',
            price: 8.50,
            category: 'Accessories',
            imageUrl: '/images/firelighters.jpg',
            stockQuantity: 150,
            season: 'All Year',
            features: ['Natural Materials', 'Eco-Friendly', 'Easy to Use', 'Long Burn Time'],
            isFeatured: false
          }
        ]
      })
      
      console.log('✅ Sample products created!')
    }
    
    // Create admin user if none exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminExists) {
      console.log('👤 Creating admin user...')
      const bcrypt = await import('bcryptjs')
      
      await prisma.user.create({
        data: {
          id: 'admin-' + Date.now(),
          name: 'Admin User',
          email: 'admin@hillsidelogs.com',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          emailVerified: true
        }
      })
      
      console.log('✅ Admin user created!')
      console.log('📧 Email: admin@hillsidelogs.com')
      console.log('🔑 Password: admin123')
    }
    
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    
    if (error instanceof Error && error.message?.includes('Can\'t reach database server')) {
      console.log('\n💡 Database connection failed. Try:')
      console.log('1. Check Railway dashboard for database status')
      console.log('2. Wait a few minutes and try again')
      console.log('3. Run: npx prisma db push (to apply schema)')
      console.log('4. Run this script again after schema is applied')
    }
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
