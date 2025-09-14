const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function createPaymentSettingsTable() {
  try {
    // Create payment_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS payment_settings (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        config JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert default bank transfer settings
    await sql`
      INSERT INTO payment_settings (type, enabled, display_name, description, config)
      VALUES 
        ('bank_transfer', true, 'Bank Transfer', 'Direct bank transfer payment', 
         '{"accountName": "Firewood Logs & Fuel Ltd", "accountNumber": "12345678", "sortCode": "12-34-56", "reference": "Order Reference Required"}')
      ON CONFLICT DO NOTHING
    `;

    console.log('Payment settings table created successfully!');
  } catch (error) {
    console.error('Error creating payment settings table:', error);
  }
}

createPaymentSettingsTable();
