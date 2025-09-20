require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Testing direct database connection...\n');

        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Check if products exist
        const productCount = await prisma.product.count();
        console.log(`📦 Total products in database: ${productCount}`);

        if (productCount > 0) {
            // Get sample product
            const sampleProduct = await prisma.product.findFirst({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    stockQuantity: true,
                    category: true
                }
            });
            console.log('Sample product:', sampleProduct);
        }

        // Check if users exist
        const userCount = await prisma.user.count();
        console.log(`👥 Total users in database: ${userCount}`);

        // Check admin user
        const adminUser = await prisma.user.findUnique({
            where: { email: 'support@firewoodlogsfuel.com' },
            select: { id: true, name: true, email: true, role: true }
        });
        console.log('Admin user:', adminUser);

    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();