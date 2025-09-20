// Test the products API locally
async function testProductsAPI() {
  try {
    console.log('🔍 Testing products API...');
    
    const response = await fetch('http://localhost:3000/api/products');
    console.log('📊 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const products = await response.json();
    console.log(`✅ Found ${products.length} products from API`);
    
    if (products.length > 0) {
      console.log('\n📋 Products from API:');
      products.slice(0, 5).forEach((product, index) => {
        const featured = product.isFeatured ? '⭐' : '  ';
        console.log(`${featured} ${index + 1}. ${product.name} - £${product.price}`);
      });
      
      if (products.length > 5) {
        console.log(`   ... and ${products.length - 5} more products`);
      }
    } else {
      console.log('❌ No products returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the development server is running (npm run dev)');
    }
  }
}

// Test with Node.js fetch (available in Node 18+)
if (typeof fetch === 'undefined') {
  // For older Node versions, we need to import fetch
  const { default: fetch } = require('node-fetch');
  global.fetch = fetch;
}

testProductsAPI();