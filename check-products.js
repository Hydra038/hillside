const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Use the hardcoded URL since env loading isn't working
const DATABASE_URL = 'postgresql://postgres:Derq@038!@db.fyjmczdbllubrssixpnx.supabase.co:5432/postgres';

async function checkAndInsertProducts() {
    try {
        // Import postgres after we've set up the environment
        const postgres = require('postgres');

        console.log('🔍 Checking products in database...');

        const sql = postgres(DATABASE_URL, {
            ssl: 'require'
        });

        // Check if products exist
        const existingProducts = await sql`SELECT COUNT(*) as count FROM products`;
        const productCount = parseInt(existingProducts[0].count);
        
        console.log(`📊 Found ${productCount} products in database`);

        if (productCount === 0) {
            console.log('📦 No products found. Inserting sample products...');
            
            // Insert sample firewood products
            await sql`
                INSERT INTO products (name, description, price, category, season, stock_quantity, features) VALUES
                ('Premium Hardwood Mix', 'A premium blend of oak, ash, and beech hardwood. Perfect for long-burning fires with excellent heat output.', 65.00, 'hardwood', 'all-season', 50, '["Ready to burn", "Low moisture content", "Long burning", "High heat output"]'),
                ('Seasoned Oak Logs', 'Traditional oak logs, seasoned for 18+ months. Ideal for wood burners and open fires.', 70.00, 'hardwood', 'winter', 40, '["18+ months seasoned", "Clean burning", "Traditional choice", "Excellent for cooking"]'),
                ('Silver Birch Bundle', 'Quick-lighting silver birch logs, perfect for kindling and getting fires started quickly.', 45.00, 'softwood', 'all-season', 60, '["Quick lighting", "Great for kindling", "Clean burning", "Pleasant aroma"]'),
                ('Kiln Dried Ash', 'Premium kiln-dried ash logs with moisture content below 20%. Ready to burn immediately.', 75.00, 'hardwood', 'winter', 35, '["Kiln dried", "Below 20% moisture", "Ready to burn", "Premium quality"]'),
                ('Eco Firelighters', 'Natural wood wool firelighters made from sustainable materials. Chemical-free ignition.', 8.50, 'accessories', 'all-season', 100, '["Natural wood wool", "Chemical free", "Sustainable", "Easy ignition"]'),
                ('Mixed Softwood Bundle', 'A mix of pine and fir logs, ideal for outdoor fire pits and quick heating.', 40.00, 'softwood', 'summer', 45, '["Mixed softwood", "Great for fire pits", "Quick heating", "Outdoor use"]')
            `;
            
            console.log('✅ Sample products inserted successfully!');
            
            // Verify insertion
            const newCount = await sql`SELECT COUNT(*) as count FROM products`;
            console.log(`📊 Now have ${newCount[0].count} products in database`);
            
        } else {
            console.log('✅ Products already exist in database');
            
            // Show existing products
            const products = await sql`SELECT id, name, price, category, stock_quantity FROM products LIMIT 10`;
            console.log('\n📋 Existing products:');
            products.forEach(product => {
                console.log(`   • ${product.name} - £${product.price} (Stock: ${product.stock_quantity})`);
            });
        }

        // Check RLS policies on products table
        console.log('\n🔒 Checking RLS status for products table...');
        const rlsStatus = await sql`
            SELECT schemaname, tablename, rowsecurity, hasrls
            FROM pg_tables t
            JOIN pg_class c ON c.relname = t.tablename
            WHERE t.tablename = 'products'
        `;
        
        if (rlsStatus.length > 0) {
            const status = rlsStatus[0];
            console.log(`   • RLS enabled: ${status.hasrls ? 'Yes' : 'No'}`);
            
            if (!status.hasrls) {
                console.log('⚠️  RLS not enabled on products table. This might be why products aren\'t showing.');
                console.log('💡 Run the RLS setup script or enable RLS manually.');
            }
        }

        await sql.end();

    } catch (error) {
        console.error('❌ Error checking products:', error.message);
        console.error('Full error:', error);
    }
}

checkAndInsertProducts();