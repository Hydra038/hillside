import { db } from '../src/lib/db'
import { randomUUID } from 'crypto'
import { orders, orderItems, users, products } from '../src/lib/db/schema.mysql'
import { eq } from 'drizzle-orm'

async function createTestOrder() {
  try {
    console.log('Creating test order...')

    // Find the test user (test@example.com)
    const user = await db.select().from(users).where(eq(users.email, 'test@example.com')).limit(1)
    
    if (user.length === 0) {
      console.error('Test user not found. Please create a user first.')
      return
    }

    // Get some products
    const productList = await db.select().from(products).limit(2)
    
    if (productList.length === 0) {
      console.error('No products found. Please create products first.')
      return
    }

    // Calculate total
    const total = productList.reduce((sum, product) => sum + Number(product.price), 0)

    // Create order
    const orderId = randomUUID();
    await db.insert(orders).values({
      id: orderId,
      userId: user[0].id,
      total: total.toString(),
      status: 'pending',
      shippingAddress: {
        street: '123 Oak Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'United Kingdom'
      }
    });

    // Create order items
    await db.insert(orderItems).values(
      productList.map((product, index) => ({
        orderId: orderId,
        productId: product.id,
        quantity: index + 1, // 1 for first product, 2 for second
        priceAtTime: product.price
      }))
    );

    console.log('✅ Test order created successfully!')
    console.log('Order ID:', orderId)
    console.log('Total:', `£${total.toFixed(2)}`)
    console.log('Products:', productList.map(p => p.name).join(', '))

  } catch (error) {
    console.error('❌ Error creating test order:', error)
  }
}

createTestOrder()
