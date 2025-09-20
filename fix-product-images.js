require('dotenv').config();
const { Client } = require('pg');

async function fixProductImages() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
        console.log('Connected to database');

        // Map of product names to actual image files
        const imageMapping = {
            'Premium Oak Firewood': '/images/products/oak-logs.jpg',
            'Oak Firewood Bundle': '/images/products/oak-logs.jpg',
            'Premium Ash Hardwood': '/images/products/ash-hardwood-logs.jpg',
            'Ash Hardwood Logs': '/images/products/ash-hardwood-logs.jpg',
            'Mixed Hardwood Logs': '/images/products/mixed-hardwood-softwood-logs.webp',
            'Kiln Dried Hardwood': '/images/products/kiln-dried-hardwood-logs.webp',
            'Bulk Hardwood Logs': '/images/products/bulk-hardwood-logs-crate.webp',
            'Premium Seasoned Hardwood': '/images/products/premium-firewood.jpg',
            'Birch Firewood Premium': '/images/products/premium-firewood.jpg',
            'Hickory Firewood': '/images/products/premium-firewood.jpg',
            'Cherry Wood Logs': '/images/products/premium-firewood.jpg',
            'Aged Oak Logs': '/images/products/oak-logs.jpg',
            'Pine Firewood': '/images/products/seasoned-softwood-logs.webp',
            'Maple Firewood': '/images/products/premium-firewood.jpg',
            'Apple Firewood': '/images/products/premium-firewood.jpg',
            'Compressed Logs': '/images/products/premium-firewood-briquettes.jpg',
            'Campfire Bundle': '/images/products/kindling-wood.png',
            'Pine Kindling': '/images/products/kindling-wood.png',
            'Cedar Kindling': '/images/products/kindling-wood.png',
            'Fire Starter Bundle': '/images/products/firelighters.webp',
            'Wood Pellets': '/images/products/wood-pellets.jpg',
            'Smokeless Coal': '/images/products/smokeless-coal.webp',
            '5 Tonne Bulk Order': '/images/products/5-tonne-offer.webp'
        };

        console.log('Updating product images...');

        for (const [productName, imageUrl] of Object.entries(imageMapping)) {
            const result = await client.query(
                'UPDATE products SET image_url = $1 WHERE name ILIKE $2',
                [imageUrl, `%${productName}%`]
            );

            if (result.rowCount > 0) {
                console.log(`✅ Updated "${productName}" -> ${imageUrl}`);
            } else {
                console.log(`⚠️  No product found matching "${productName}"`);
            }
        }

        // Set default image for any products without images
        const defaultResult = await client.query(
            "UPDATE products SET image_url = '/images/products/premium-firewood.jpg' WHERE image_url IS NULL OR image_url = ''"
        );

        if (defaultResult.rowCount > 0) {
            console.log(`✅ Set default image for ${defaultResult.rowCount} products`);
        }

        console.log('✅ Image update complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

fixProductImages();