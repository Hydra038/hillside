const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleProducts() {
  try {
    console.log('🔍 Checking existing products...');
    
    const existingProducts = await prisma.product.count();
    console.log(`Found ${existingProducts} existing products`);
    
    if (existingProducts === 0) {
      console.log('📦 Adding sample products...');
      
      const products = [
        {
          name: 'Premium Hardwood Mix',
          description: 'A premium blend of oak, ash, and beech hardwood. Perfect for long-burning fires with excellent heat output.',
          price: '65.00',
          category: 'hardwood',
          imageUrl: '/images/products/premium-firewood.jpg',
          stockQuantity: 50,
          season: 'all-season',
          features: ['Ready to burn', 'Low moisture content', 'Long burning', 'High heat output'],
          isFeatured: true
        },
        {
          name: 'Seasoned Oak Logs',
          description: 'Traditional oak logs, seasoned for 18+ months. Ideal for wood burners and open fires.',
          price: '70.00',
          category: 'hardwood',
          imageUrl: '/images/products/oak-logs.jpg',
          stockQuantity: 40,
          season: 'winter',
          features: ['18+ months seasoned', 'Clean burning', 'Traditional choice', 'Excellent for cooking'],
          isFeatured: true
        },
        {
          name: 'Silver Birch Bundle',
          description: 'Quick-lighting silver birch logs, perfect for kindling and getting fires started quickly.',
          price: '45.00',
          category: 'softwood',
          imageUrl: '/images/products/seasoned-softwood-logs.webp',
          stockQuantity: 60,
          season: 'all-season',
          features: ['Quick lighting', 'Great for kindling', 'Clean burning', 'Pleasant aroma'],
          isFeatured: false
        },
        {
          name: 'Kiln Dried Ash',
          description: 'Premium kiln-dried ash logs with moisture content below 20%. Ready to burn immediately.',
          price: '75.00',
          category: 'hardwood',
          imageUrl: '/images/products/ash-hardwood-logs.jpg',
          stockQuantity: 35,
          season: 'winter',
          features: ['Kiln dried', 'Below 20% moisture', 'Ready to burn', 'Premium quality'],
          isFeatured: false
        },
        {
          name: 'Eco Firelighters',
          description: 'Natural wood wool firelighters made from sustainable materials. Chemical-free ignition.',
          price: '8.50',
          category: 'accessories',
          imageUrl: '/images/products/firelighters.webp',
          stockQuantity: 100,
          season: 'all-season',
          features: ['Natural wood wool', 'Chemical free', 'Sustainable', 'Easy ignition'],
          isFeatured: false
        },
        {
          name: 'Mixed Softwood Bundle',
          description: 'A mix of pine and fir logs, ideal for outdoor fire pits and quick heating.',
          price: '40.00',
          category: 'softwood',
          imageUrl: '/images/products/mixed-hardwood-softwood-logs.webp',
          stockQuantity: 45,
          season: 'summer',
          features: ['Mixed softwood', 'Great for fire pits', 'Quick heating', 'Outdoor use'],
          isFeatured: false
        }
      ];

      for (const product of products) {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Added: ${product.name}`);
      }
      
      console.log(`🎉 Successfully added ${products.length} products!`);
    } else {
      console.log('✅ Products already exist in database');
      
      // Show existing products
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          stockQuantity: true
        },
        take: 10
      });
      
      console.log('\n📋 Existing products:');
      products.forEach(product => {
        console.log(`   • ${product.name} - £${product.price} (Stock: ${product.stockQuantity})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProducts();