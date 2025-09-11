import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { sql } from '@vercel/postgres';
import { products } from './schema';

const sampleProducts = [
  {
    name: 'Premium Hardwood Logs',
    description: 'High-quality, seasoned hardwood logs perfect for long-lasting heat.',
    price: '120.00',
    category: 'hardwood',
    imageUrl: '/images/products/hardwood-logs.jpg',
    stockQuantity: 100,
    weight: '25.00',
    dimensions: {
      length: 25,
      width: 10,
      height: 10,
    },
    moisture: '20.00',
    season: 'all',
    features: [
      'Long burning time',
      'High heat output',
      'Low moisture content',
      'Minimal smoke',
    ],
  },
  {
    name: 'Softwood Kindling',
    description: 'Dry, easy-to-light kindling perfect for starting your fire.',
    price: '45.00',
    category: 'kindling',
    imageUrl: '/images/products/kindling.jpg',
    stockQuantity: 150,
    weight: '10.00',
    dimensions: {
      length: 15,
      width: 2,
      height: 2,
    },
    moisture: '15.00',
    season: 'all',
    features: [
      'Easy to light',
      'Quick burning',
      'Perfect for starting fires',
      'Conveniently sized',
    ],
  },
];

async function main() {
  try {
    const db = drizzle(sql);
    
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations complete!');

    console.log('Inserting sample data...');
    for (const product of sampleProducts) {
      await db.insert(products).values(product).onConflictDoNothing();
    }
    console.log('Sample data inserted!');

    const allProducts = await db.select().from(products);
    console.log('Current products in database:', allProducts);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
