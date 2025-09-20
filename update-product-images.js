const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateProductImages() {
  try {
    console.log('🖼️  Updating product image URLs to match available images...');
    
    // First, let's see what products we have
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    });
    
    console.log(`Found ${products.length} products to update`);
    
    // Map products to correct image paths
    const imageMapping = {
      'oak': '/images/products/oak-logs.jpg',
      'hardwood': '/images/products/premium-firewood.jpg',
      'mixed': '/images/products/mixed-hardwood-softwood-logs.webp',
      'birch': '/images/products/seasoned-softwood-logs.webp',
      'ash': '/images/products/ash-hardwood-logs.jpg',
      'kindling': '/images/products/kindling-wood.png',
      'firelighter': '/images/products/firelighters.webp',
      'pine': '/images/products/seasoned-softwood-logs.webp',
      'cherry': '/images/products/premium-firewood.jpg',
      'bulk': '/images/products/bulk-hardwood-logs-crate.webp',
      'crate': '/images/products/bulk-hardwood-logs-crate.webp',
      'kiln': '/images/products/kiln-dried-hardwood-logs.webp',
      'hickory': '/images/products/premium-firewood.jpg',
      'maple': '/images/products/premium-firewood.jpg',
      'apple': '/images/products/premium-firewood.jpg',
      'cedar': '/images/products/seasoned-softwood-logs.webp',
      'campfire': '/images/products/mixed-hardwood-softwood-logs.webp',
      'compressed': '/images/products/premium-firewood-briquettes.jpg',
      'starter': '/images/products/firelighters.webp'
    };
    
    let updatedCount = 0;
    
    for (const product of products) {
      let newImageUrl = '/images/products/premium-firewood.jpg'; // default
      
      // Find matching image based on product name
      const productNameLower = product.name.toLowerCase();
      for (const [keyword, imagePath] of Object.entries(imageMapping)) {
        if (productNameLower.includes(keyword)) {
          newImageUrl = imagePath;
          break;
        }
      }
      
      // Update the product
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newImageUrl }
      });
      
      console.log(`✅ ${product.name} → ${newImageUrl}`);
      updatedCount++;
    }
    
    console.log(`\n🎉 Updated ${updatedCount} product images!`);
    
    // Verify the updates
    const updatedProducts = await prisma.product.findMany({
      select: {
        name: true,
        imageUrl: true,
        isFeatured: true
      },
      orderBy: { isFeatured: 'desc' },
      take: 5
    });
    
    console.log('\n📋 First 5 products with updated images:');
    updatedProducts.forEach(p => {
      const star = p.isFeatured ? '⭐' : '  ';
      console.log(`${star} ${p.name} → ${p.imageUrl}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating images:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductImages();