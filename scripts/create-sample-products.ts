import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function createSampleProducts() {
  try {
    console.log('Creating sample firewood products...')
    
    // Clear existing products first
    await sql`DELETE FROM products`
    
    // Create sample products
    const sampleProducts = [
      {
        name: 'Premium Oak Logs',
        description: 'High-quality seasoned oak logs perfect for fireplaces and wood burners. Burns clean with excellent heat output.',
        price: 45.99,
        category: 'Hardwood',
        stock_quantity: 50,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
        weight: 25,
        dimensions: { length: 40, width: 15, height: 15 },
        moisture: 15,
        season: 'Winter',
        features: ['Premium Quality', 'Seasoned', 'High Heat Output']
      },
      {
        name: 'Mixed Hardwood Bundle',
        description: 'A variety of seasoned hardwoods including ash, beech, and birch. Great value for money.',
        price: 38.50,
        category: 'Hardwood',
        stock_quantity: 75,
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
        weight: 20,
        dimensions: { length: 35, width: 12, height: 12 },
        moisture: 18,
        season: 'All Season',
        features: ['Mixed Woods', 'Great Value', 'Versatile']
      },
      {
        name: 'Birch Logs - Small',
        description: 'Beautiful birch logs with distinctive white bark. Perfect for kindling and smaller fires.',
        price: 25.00,
        category: 'Kindling',
        stock_quantity: 100,
        image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&q=80',
        weight: 10,
        dimensions: { length: 25, width: 8, height: 8 },
        moisture: 20,
        season: 'All Season',
        features: ['White Bark', 'Small Size', 'Perfect for Kindling']
      },
      {
        name: 'Ash Logs - Large',
        description: 'Premium ash logs that burn hot and clean. Ideal for overnight burning in larger stoves.',
        price: 52.99,
        category: 'Hardwood',
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=80',
        weight: 30,
        dimensions: { length: 50, width: 20, height: 20 },
        moisture: 15,
        season: 'Winter',
        features: ['Large Size', 'Long Burning', 'Clean Burn']
      },
      {
        name: 'Kindling Bundle',
        description: 'Dry kindling wood perfect for starting fires. Essential for any wood burning setup.',
        price: 12.99,
        category: 'Kindling',
        stock_quantity: 200,
        image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80',
        weight: 5,
        dimensions: { length: 20, width: 5, height: 5 },
        moisture: 12,
        season: 'All Season',
        features: ['Extra Dry', 'Fire Starter', 'Essential']
      },
      {
        name: 'Beech Logs - Premium',
        description: 'Top quality beech logs that burn slowly and evenly. Excellent for long-lasting fires.',
        price: 48.75,
        category: 'Hardwood',
        stock_quantity: 40,
        image_url: 'https://images.unsplash.com/photo-1515378791036-0648a814e3e6?w=500&q=80',
        weight: 25,
        dimensions: { length: 45, width: 18, height: 18 },
        moisture: 16,
        season: 'Winter',
        features: ['Slow Burning', 'Even Heat', 'Premium Grade']
      }
    ]

    for (const product of sampleProducts) {
      await sql`
        INSERT INTO products (name, description, price, category, image_url, stock_quantity, weight, dimensions, moisture, season, features)
        VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.image_url}, ${product.stock_quantity}, ${product.weight}, ${JSON.stringify(product.dimensions)}, ${product.moisture}, ${product.season}, ${JSON.stringify(product.features)})
      `
    }

    console.log('✅ Sample products created successfully!')
    
    // Fetch and display created products
    const products = await sql`SELECT * FROM products ORDER BY name`
    console.log(`📦 Total products: ${products.length}`)
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - £${product.price}`)
    })

  } catch (error) {
    console.error('❌ Error creating products:', error)
  }
}

createSampleProducts()
