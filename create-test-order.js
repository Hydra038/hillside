const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function createTestOrder() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'hillside',
    password: 'Derq@038!',
    database: 'firewood'
  });

  console.log('🔗 Connected to database');

  try {
    // Check if our test user exists
    const [users] = await connection.execute(
      'SELECT id, name, email FROM users WHERE email = ?',
      ['test@example.com']
    );

    if (users.length === 0) {
      console.log('❌ Test user not found. Please sign up first with test@example.com');
      return;
    }

    const testUser = users[0];
    console.log(`✅ Found test user: ${testUser.name} (${testUser.email})`);

    // Create a test order
    const orderId = uuidv4();
    const shippingAddress = {
      street: '123 Test Street',
      city: 'Test City',
      postcode: 'TE1 2ST',
      country: 'UK'
    };

    await connection.execute(
      `INSERT INTO orders (id, userId, total, status, shippingAddress, paymentMethod, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        orderId,
        testUser.id,
        45.99,
        'processing',
        JSON.stringify(shippingAddress),
        'Credit Card'
      ]
    );

    console.log(`✅ Created test order: ${orderId}`);

    // Add some order items
    const orderItemId1 = uuidv4();
    const orderItemId2 = uuidv4();

    // Get product IDs from database
    const [products] = await connection.execute(
      'SELECT id, name, price FROM products LIMIT 2'
    );

    if (products.length >= 2) {
      await connection.execute(
        `INSERT INTO orderItems (id, orderId, productId, quantity, priceAtTime) VALUES (?, ?, ?, ?, ?)`,
        [orderItemId1, orderId, products[0].id, 2, 22.99]
      );

      await connection.execute(
        `INSERT INTO orderItems (id, orderId, productId, quantity, priceAtTime) VALUES (?, ?, ?, ?, ?)`,
        [orderItemId2, orderId, products[1].id, 1, 22.99]
      );

      console.log('✅ Added order items');
      console.log(`   - 2x ${products[0].name} @ £22.99 each`);
      console.log(`   - 1x ${products[1].name} @ £22.99`);
    }

    console.log('\n🎉 Test order created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Sign in as admin at http://localhost:3000/admin');
    console.log(`2. Go to Orders Management`);
    console.log(`3. Find order #${orderId.slice(0, 8)} and change status to "shipped"`);
    console.log('4. Check console for shipping email');
    console.log('5. Sign in as test@example.com and check order history');
    console.log('6. Download invoice from order history');

  } catch (error) {
    console.error('❌ Error creating test order:', error);
  } finally {
    await connection.end();
    console.log('🔐 Database connection closed');
  }
}

createTestOrder();
