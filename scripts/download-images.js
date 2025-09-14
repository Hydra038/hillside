const https = require('https');
const fs = require('fs');
const path = require('path');

// Create the products directory if it doesn't exist
const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log('✅ Created products directory:', productsDir);
}

// Current Unsplash URLs and their corresponding local filenames
const imageDownloads = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
    filename: 'oak-logs.jpg',
    product: 'Premium Oak Logs'
  },
  {
    url: 'https://images.unsplash.com/photo-1551801841-ecad875a020?w=400&h=300&fit=crop&auto=format',
    filename: 'mixed-hardwood.jpg',
    product: 'Mixed Hardwood Bundle'
  },
  {
    url: 'https://images.unsplash.com/photo-1445024441609-ba2eb8650f95?w=400&h=300&fit=crop&auto=format',
    filename: 'birch-logs.jpg',
    product: 'Birch Logs - Small'
  },
  {
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop&auto=format',
    filename: 'ash-logs.jpg',
    product: 'Ash Logs - Large'
  },
  {
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format',
    filename: 'kindling-bundle.jpg',
    product: 'Kindling Bundle'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
    filename: 'beech-logs.jpg',
    product: 'Beech Logs - Premium'
  },
  {
    url: 'https://images.unsplash.com/photo-1550985543-52d8ee9d0c2c?w=400&h=300&fit=crop&auto=format',
    filename: 'special-offer-5-tonnes.jpg',
    product: '5 Tonnes Mixed Hardwood - Special Offer'
  }
];

function downloadImage(imageUrl, filepath, productName) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading ${productName}...`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${productName}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Starting image downloads...');
  console.log(`📁 Saving to: ${productsDir}`);
  console.log('=====================================');
  
  try {
    for (const imageInfo of imageDownloads) {
      const filepath = path.join(productsDir, imageInfo.filename);
      await downloadImage(imageInfo.url, filepath, imageInfo.product);
    }
    
    console.log('\n🎉 All images downloaded successfully!');
    console.log('=====================================');
    console.log('📋 Downloaded files:');
    
    // List all downloaded files
    const files = fs.readdirSync(productsDir);
    files.forEach((file, index) => {
      const filePath = path.join(productsDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`${index + 1}. ${file} (${sizeKB} KB)`);
    });
    
    console.log('\n📍 Next steps:');
    console.log('1. Run the update script to switch to local images:');
    console.log('   node scripts/update-local-images.js');
    console.log('2. Restart your development server to see the changes');
    
  } catch (error) {
    console.error('❌ Error downloading images:', error.message);
  }
}

downloadAllImages();
