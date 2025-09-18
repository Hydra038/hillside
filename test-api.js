// Test API endpoints
async function testAPIEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔄 Testing API endpoints...\n');
  
  try {
    // Test products endpoint
    console.log('1. Testing /api/products');
    const productsResponse = await fetch(`${baseUrl}/api/products`);
    const products = await productsResponse.json();
    
    if (productsResponse.ok) {
      console.log(`✅ Products API: Found ${products.length} products`);
      console.log(`   First product: ${products[0]?.name} - $${products[0]?.price}`);
    } else {
      console.log(`❌ Products API failed:`, products);
    }
    
    // Test featured products endpoint
    console.log('\n2. Testing /api/products/featured');
    const featuredResponse = await fetch(`${baseUrl}/api/products/featured`);
    const featured = await featuredResponse.json();
    
    if (featuredResponse.ok) {
      console.log(`✅ Featured API: Found ${featured.length} featured products`);
      featured.forEach(product => {
        console.log(`   ⭐ ${product.name} - $${product.price}`);
      });
    } else {
      console.log(`❌ Featured API failed:`, featured);
    }
    
    // Test individual product endpoint
    if (products.length > 0) {
      console.log(`\n3. Testing /api/products/${products[0].id}`);
      const productResponse = await fetch(`${baseUrl}/api/products/${products[0].id}`);
      const product = await productResponse.json();
      
      if (productResponse.ok) {
        console.log(`✅ Individual Product API: ${product.name}`);
        console.log(`   Description: ${product.description.substring(0, 50)}...`);
        console.log(`   Features:`, product.features);
      } else {
        console.log(`❌ Individual Product API failed:`, product);
      }
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPIEndpoints();
