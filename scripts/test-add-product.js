import fetch from 'node-fetch';

async function testAddProduct() {
  const product = {
    name: 'Test Firewood',
    description: 'Premium hardwood logs for testing.',
    price: 19.99,
    category: 'hardwood',
    imageUrl: 'https://example.com/test.jpg',
    stockQuantity: 50,
    season: 'winter',
    features: ['long-burning', 'low smoke'],
  };

  const response = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  const result = await response.json();
  console.log('Add product result:', result);
}

testAddProduct();
