const { PrismaClient } = require('@prisma/client');

// Force Supabase connection
const DATABASE_URL = "postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function addProductsToSupabase() {
  try {
    console.log('🔗 Connecting to Supabase database...');
    console.log('📍 Database:', DATABASE_URL.split('@')[1]?.split('/')[0]);
    
    const count = await prisma.product.count();
    console.log(`Found ${count} products in Supabase database`);
    
    if (count === 0) {
      console.log('📦 Adding products to Supabase...');
      
      const products = [
        {
          name: 'Premium Oak Firewood',
          description: 'High-quality seasoned oak logs, perfect for long-burning fires with excellent heat output.',
          price: '89.99',
          category: 'hardwood',
          imageUrl: '/images/products/oak-logs.jpg',
          stockQuantity: 50,
          season: 'winter',
          features: ['Seasoned 18+ months', 'High heat output', 'Long burning', 'Clean burning'],
          isFeatured: true
        },
        {
          name: 'Mixed Hardwood Bundle',
          description: 'Premium mix of oak, ash, and beech. Ideal for wood burners and open fires.',
          price: '69.99',
          category: 'hardwood',
          imageUrl: '/images/products/premium-firewood.jpg',
          stockQuantity: 75,
          season: 'all-season',
          features: ['Mixed hardwood', 'Ready to burn', 'Sustainable source', 'Excellent value'],
          isFeatured: true
        },
        {
          name: 'Silver Birch Logs',
          description: 'Quick-lighting birch logs, perfect for kindling and getting fires started.',
          price: '45.99',
          category: 'softwood',
          imageUrl: '/images/products/seasoned-softwood-logs.webp',
          stockQuantity: 60,
          season: 'all-season',
          features: ['Quick lighting', 'Great for kindling', 'Pleasant aroma', 'Clean burning'],
          isFeatured: false
        },
        {
          name: 'Kiln Dried Ash Logs',
          description: 'Premium kiln-dried ash with moisture content below 20%. Ready to burn immediately.',
          price: '79.99',
          category: 'hardwood',
          imageUrl: '/images/products/ash-hardwood-logs.jpg',
          stockQuantity: 40,
          season: 'winter',
          features: ['Kiln dried', 'Below 20% moisture', 'Immediate use', 'Premium quality'],
          isFeatured: true
        },
        {
          name: 'Natural Firelighters',
          description: 'Chemical-free wood wool firelighters made from sustainable materials.',
          price: '12.99',
          category: 'accessories',
          imageUrl: '/images/products/firelighters.webp',
          stockQuantity: 100,
          season: 'all-season',
          features: ['Chemical free', 'Natural wood wool', 'Easy ignition', 'Eco-friendly'],
          isFeatured: false
        },
        {
          name: 'Pine Kindling Pack',
          description: 'Dry pine kindling sticks, perfect for starting fires quickly and easily.',
          price: '24.99',
          category: 'kindling',
          imageUrl: '/images/products/kindling-wood.png',
          stockQuantity: 80,
          season: 'all-season',
          features: ['Dry kindling', 'Quick lighting', 'Perfect size', 'Ready to use'],
          isFeatured: false
        },
        {
          name: 'Cherry Firewood',
          description: 'Sweet-scented cherry wood logs, perfect for BBQ and indoor fires.',
          price: '95.99',
          category: 'hardwood',
          imageUrl: '/images/products/premium-firewood.jpg',
          stockQuantity: 25,
          season: 'all-season',
          features: ['Sweet aroma', 'Great for cooking', 'Premium hardwood', 'Long burning'],
          isFeatured: true
        },
        {
          name: 'Bulk Hardwood Crate',
          description: 'Large crate of mixed hardwood logs for serious wood burner users.',
          price: '149.99',
          category: 'hardwood',
          imageUrl: '/images/products/bulk-hardwood-logs-crate.webp',
          stockQuantity: 15,
          season: 'winter',
          features: ['Bulk quantity', 'Mixed hardwood', 'Great value', 'Long lasting'],
          isFeatured: true
        }
      ];

      for (const product of products) {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Added: ${product.name}`);
      }
      
      console.log(`🎉 Successfully added ${products.length} products to Supabase!`);
      
    } else {
      console.log('✅ Products already exist in Supabase');
      
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
          isFeatured: true
        },
        take: 10
      });
      
      console.log('📋 Existing products in Supabase:');
      products.forEach(product => {
        const featured = product.isFeatured ? '⭐' : '  ';
        console.log(`${featured} ${product.name} - £${product.price} (Stock: ${product.stockQuantity})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.log('🌐 Network issue connecting to Supabase. Check your internet connection.');
    } else if (error.message.includes('authentication')) {
      console.log('🔑 Authentication issue. Check your database credentials.');
    } else if (error.message.includes('does not exist')) {
      console.log('🗄️  Table does not exist. Run database migrations first.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

addProductsToSupabase();