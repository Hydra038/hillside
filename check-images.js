require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function checkProductImages() {
    const prisma = new PrismaClient();

    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true
            },
            take: 10
        });

        console.log('Product images in database:');
        products.forEach(product => {
            console.log(`${product.id}. ${product.name}`);
            console.log(`   Image URL: ${product.imageUrl || 'NULL'}`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkProductImages();