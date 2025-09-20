const { Client } = require('pg');
require('dotenv').config();

async function listProducts() {
  const client = new Client(process.env.DATABASE_URL);
  try {
    await client.connect();
    const result = await client.query('SELECT id, name, image_url FROM products ORDER BY id');
    console.log('Products in database:');
    result.rows.forEach(product => {
      console.log(`${product.id}. ${product.name}`);
      console.log(`   Image: ${product.image_url || 'NULL'}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}
listProducts();