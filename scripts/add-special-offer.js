const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function addSpecialOfferProduct() {
  try {
    console.log('Adding 5 Tonnes Wood Special Offer...\n');
    
    // Check current products first
    const currentProducts = await sql`SELECT name, price FROM products ORDER BY name`;
    console.log('Current products:');
    currentProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - £${product.price}`);
    });
    console.log('');
    
    // Add the special offer product
    const specialOffer = {
      name: '5 Tonnes Mixed Hardwood - Special Offer',
      description: 'AMAZING OFFER! 5 tonnes of premium mixed hardwood including oak, ash, beech, and birch. Perfect for the whole winter season. Properly seasoned and ready to burn. Massive savings compared to buying individual bundles!',
      price: 200.00,
      category: 'Special Offers',
      stock_quantity: 25,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      weight: 5000, // 5 tonnes = 5000kg
      dimensions: { length: 40, width: 120, height: 150 }, // Large delivery dimensions
      moisture: 18,
      season: 'All Season',
      features: ['5 Tonnes', 'Special Offer', 'Bulk Discount', 'Mixed Hardwood', 'Winter Supply', 'Free Delivery']
    };

    await sql`
      INSERT INTO products (name, description, price, category, image_url, stock_quantity, weight, dimensions, moisture, season, features)
      VALUES (${specialOffer.name}, ${specialOffer.description}, ${specialOffer.price}, ${specialOffer.category}, ${specialOffer.image_url}, ${specialOffer.stock_quantity}, ${specialOffer.weight}, ${JSON.stringify(specialOffer.dimensions)}, ${specialOffer.moisture}, ${specialOffer.season}, ${JSON.stringify(specialOffer.features)})
    `;

    console.log('✅ Special offer product added successfully!\n');
    
    // Show updated product list
    const updatedProducts = await sql`SELECT * FROM products ORDER BY price DESC`;
    console.log('Updated product catalog:');
    updatedProducts.forEach((product, index) => {
      const savings = product.category === 'Special Offers' ? ' 🔥 SPECIAL OFFER!' : '';
      console.log(`${index + 1}. ${product.name} - £${product.price}${savings}`);
    });
    
    console.log('\n📊 Special Offer Details:');
    console.log('Product: 5 Tonnes Mixed Hardwood - Special Offer');
    console.log('Price: £200.00');
    console.log('Weight: 5,000kg (5 tonnes)');
    console.log('Stock: 25 units available');
    console.log('Features: Bulk discount, mixed hardwood, winter supply, free delivery');
    console.log('Savings: Approximately 60% off regular pricing!');

  } catch (error) {
    console.error('❌ Error adding special offer:', error);
  }
}

addSpecialOfferProduct();
