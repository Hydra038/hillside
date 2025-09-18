import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function setupSupabaseData() {
  try {
    console.log('🔄 Setting up Supabase database with sample data...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Supabase connection successful!')
    
    // Create sample products
    console.log('🔄 Creating sample firewood products...')
    
    const products = await prisma.product.createMany({
      data: [
        {
          name: "Premium Oak Firewood",
          description: "High-quality seasoned oak firewood, perfect for long-burning fires with excellent heat output. Ideal for wood stoves and fireplaces.",
          price: 89.99,
          category: "hardwood",
          imageUrl: "/images/oak-firewood.jpg",
          stockQuantity: 50,
          season: "all-season",
          features: {
            "burnTime": "4-6 hours",
            "heatOutput": "High",
            "moistureContent": "15-20%",
            "seasoned": true,
            "weight": "40 lbs per bundle"
          },
          isFeatured: true
        },
        {
          name: "Mixed Hardwood Bundle",
          description: "A perfect mix of oak, maple, and birch for versatile burning needs. Great for both indoor and outdoor use.",
          price: 69.99,
          category: "hardwood",
          imageUrl: "/images/mixed-hardwood.jpg",
          stockQuantity: 75,
          season: "all-season",
          features: {
            "burnTime": "3-5 hours",
            "heatOutput": "Medium-High",
            "moistureContent": "18-22%",
            "variety": "Oak, Maple, Birch",
            "weight": "35 lbs per bundle"
          },
          isFeatured: true
        },
        {
          name: "Pine Kindling Pack",
          description: "Easy-to-light pine kindling, perfect for starting fires quickly. Essential for any fire-starting kit.",
          price: 24.99,
          category: "softwood",
          imageUrl: "/images/pine-kindling.jpg",
          stockQuantity: 100,
          season: "all-season",
          features: {
            "burnTime": "30-60 minutes",
            "heatOutput": "Medium",
            "purpose": "Fire starting",
            "pieces": "50+ pieces",
            "weight": "15 lbs per bundle"
          },
          isFeatured: false
        },
        {
          name: "Birch Firewood",
          description: "Beautiful white birch logs that burn cleanly with a pleasant aroma. Perfect for special occasions.",
          price: 79.99,
          category: "hardwood",
          imageUrl: "/images/birch-firewood.jpg",
          stockQuantity: 30,
          season: "winter",
          features: {
            "burnTime": "3-4 hours",
            "heatOutput": "Medium-High",
            "moistureContent": "16-20%",
            "aroma": "Pleasant",
            "appearance": "White bark"
          },
          isFeatured: true
        }
      ],
      skipDuplicates: true
    })
    
    console.log(`✅ Created ${products.count} sample products`)
    
    // Create payment settings
    console.log('🔄 Setting up payment methods...')
    
    const paymentSettings = await prisma.paymentSetting.createMany({
      data: [
        {
          type: "cash_on_delivery",
          displayName: "Cash on Delivery",
          description: "Pay when your firewood is delivered to your door",
          enabled: true,
          config: {
            "fee": 0,
            "description": "No additional fees for cash payments",
            "minOrder": 25.00
          }
        },
        {
          type: "bank_transfer",
          displayName: "Bank Transfer",
          description: "Direct bank transfer payment - get 5% discount",
          enabled: true,
          config: {
            "accountNumber": "123-456-789",
            "bankName": "Hillside Firewood Bank",
            "routingNumber": "987654321",
            "discount": 5,
            "fee": 0
          }
        }
      ],
      skipDuplicates: true
    })
    
    console.log(`✅ Created ${paymentSettings.count} payment methods`)
    
    console.log('🎉 Supabase database setup complete!')
    console.log('📝 Check your Supabase dashboard to see the tables and data!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    
    if (error instanceof Error && error.message.includes("Can't reach database server")) {
      console.log('\n💡 Database connection failed. Try:')
      console.log('1. Check your Supabase dashboard for database status')
      console.log('2. Verify your database password is correct')
      console.log('3. Check if your IP is allowed in Supabase settings')
      console.log('4. Wait a few minutes and try again')
    }
  } finally {
    await prisma.$disconnect()
  }
}

setupSupabaseData()
