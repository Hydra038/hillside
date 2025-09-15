const mysql = require('mysql2/promise');

async function addSpecialOffer() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'hillside',
    password: 'Derq@038!',
    database: 'firewood',
  });

  // Remove one featured product
  await connection.execute('UPDATE products SET is_featured = 0 WHERE is_featured = 1 LIMIT 1');

  // Insert the special offer product (fill all required fields)
  await connection.execute(
    `INSERT INTO products (name, description, price, category, stock_quantity, is_featured, image_url, weight, dimensions, moisture, season, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      '5 Tonne Firewood Offer',
      'Special offer: 5 tonnes of premium firewood for only £200.',
      200.00,
      'Special Offers',
      10,
      1,
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      5000,
      JSON.stringify({ length: 120, width: 100, height: 150 }),
      18,
      'All Season',
      JSON.stringify(['5 Tonnes', 'Special Offer', 'Bulk Discount', 'Mixed Hardwood', 'Winter Supply', 'Free Delivery'])
    ]
  );

  await connection.end();
  console.log('Special offer product added!');
}

addSpecialOffer();
