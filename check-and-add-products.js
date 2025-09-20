const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndAddProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    const count = await prisma.product.count();
    console.log(`Found ${count} products in database`);
    
    if (count === 0) {
      console.log('📦 No products found. Adding sample products...');
      
      const sampleProducts = [
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
        }
      ];

      for (const product of sampleProducts) {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Added: ${product.name}`);
      }
      
      console.log(`🎉 Successfully added ${sampleProducts.length} products!`);
      
    } else {
      console.log('📋 Existing products:');
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
      
      products.forEach(product => {
        const featured = product.isFeatured ? '⭐' : '  ';
        console.log(`${featured} ${product.name} - £${product.price} (Stock: ${product.stockQuantity})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Table might not exist. Try running database migrations first.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkAndAddProducts();