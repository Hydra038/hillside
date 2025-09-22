// Script to list all products with '5 Tonne' or similar in the name and their prices
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function listFiveTonneProducts() {
    const prisma = new PrismaClient();
    try {
        console.log('Listing all products with "5 Tonne" or similar in the name...\n');
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: '5 Tonne', mode: 'insensitive' } },
                    { name: { contains: '5 Tonnes', mode: 'insensitive' } },
                    { name: { contains: '5tonne', mode: 'insensitive' } },
                    { name: { contains: '5tonnes', mode: 'insensitive' } },
                    { name: { contains: 'five tonne', mode: 'insensitive' } },
                    { name: { contains: 'five tonnes', mode: 'insensitive' } },
                ]
            },
            select: {
                id: true,
                name: true,
                price: true,
                category: true
            }
        });
        if (products.length === 0) {
            console.log('No matching products found.');
        } else {
            products.forEach(p => {
                console.log(`ID: ${p.id}`);
                console.log(`Name: ${p.name}`);
                console.log(`Category: ${p.category}`);
                console.log(`Price: £${p.price}`);
                console.log('---');
            });
        }
    } catch (error) {
        console.error('Error listing products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

listFiveTonneProducts();
