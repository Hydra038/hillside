import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  return setupDatabase();
}

export async function POST(request: Request) {
  return setupDatabase();
}

async function setupDatabase() {
  try {
    console.log('Setting up production database...');
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to database');

    try {
      // Create contact_messages table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          replied TINYINT NOT NULL DEFAULT 0
        )
      `);
      console.log('✅ contact_messages table created');

      // Create support_messages table  
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS support_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          sender ENUM('user', 'admin') NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          thread_id INT
        )
      `);
      console.log('✅ support_messages table created');

      // Create users table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
          address JSON,
          email_verified TINYINT NOT NULL DEFAULT 0,
          email_verification_token VARCHAR(255),
          email_verification_expires DATETIME,
          reset_token VARCHAR(255),
          reset_token_expires DATETIME,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ users table created');

      // Create products table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category VARCHAR(255) NOT NULL,
          image_url VARCHAR(255),
          stock_quantity INT NOT NULL DEFAULT 0,
          season VARCHAR(255),
          features JSON,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ products table created');

      // Create orders table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
          total DECIMAL(10,2) NOT NULL,
          shipping_address JSON,
          payment_method VARCHAR(255),
          payment_plan VARCHAR(32),
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      console.log('✅ orders table created');

      // Create order_items table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id VARCHAR(36) NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          price_at_time DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `);
      console.log('✅ order_items table created');

      // Create payment_settings table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS payment_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type VARCHAR(255) NOT NULL,
          display_name VARCHAR(255) NOT NULL,
          description TEXT,
          enabled TINYINT NOT NULL DEFAULT 1,
          config JSON,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ payment_settings table created');

      // Insert some sample products if the table is empty
      const [products] = await connection.execute('SELECT COUNT(*) as count FROM products') as any;
      if (products[0].count === 0) {
        console.log('Inserting sample products...');
        await connection.execute(`
          INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_featured) VALUES
          ('Premium Hardwood Logs', 'High-quality seasoned hardwood logs perfect for long-lasting heat and minimal smoke output.', 120.00, 'hardwood', '/images/hardwood-logs.jpg', 50, true),
          ('Softwood Kindling Bundle', 'Dry, easy-to-light kindling perfect for starting your fire quickly and efficiently.', 35.00, 'kindling', '/images/kindling-bundle.jpg', 100, true),
          ('Mixed Wood Special', 'Perfect combination of hardwood and softwood for optimal burning experience.', 85.00, 'mixed', '/images/mixed-wood.jpg', 75, false)
        `);
        console.log('✅ Sample products inserted');
      }

      // Insert default payment settings if empty
      const [paymentSettings] = await connection.execute('SELECT COUNT(*) as count FROM payment_settings') as any;
      if (paymentSettings[0].count === 0) {
        console.log('Inserting default payment settings...');
        await connection.execute(`
          INSERT INTO payment_settings (type, display_name, description, enabled, config) VALUES
          ('cash_on_delivery', 'Cash on Delivery', 'Pay with cash when your order is delivered', 1, '{}'),
          ('bank_transfer', 'Bank Transfer', 'Pay via direct bank transfer', 1, '{"account_name": "Hillside Logs Fuel", "account_number": "12345678", "sort_code": "12-34-56"}')
        `);
        console.log('✅ Default payment settings inserted');
      }

      console.log('🎉 Database setup completed successfully!');

      return NextResponse.json({ 
        success: true, 
        message: 'Database setup completed successfully!' 
      });

    } catch (error: any) {
      console.error('❌ Error setting up database:', error);
      return NextResponse.json({ 
        error: 'Database setup failed', 
        details: error.message 
      }, { status: 500 });
    } finally {
      await connection.end();
    }

  } catch (error: any) {
    console.error('❌ Connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to database', 
      details: error.message 
    }, { status: 500 });
  }
}
