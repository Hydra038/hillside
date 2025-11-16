import { db } from '../src/lib/db'
import { orders, orderItems, users, products } from '../src/lib/db/schema'
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
    const [order] = await db.insert(orders).values({
      userId: user[0].id,
      total: total.toString(),
      status: 'processing',
      shippingAddress: {
        street: '123 Oak Street',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'United Kingdom'
      }
    }).returning()

    // Create order items
    await db.insert(orderItems).values(
      productList.map((product, index) => ({
        orderId: order.id,
        productId: product.id,
        quantity: index + 1, // 1 for first product, 2 for second
        priceAtTime: product.price
      }))
    )

    console.log('✅ Test order created successfully!')
    console.log('Order ID:', order.id)
    console.log('Total:', `£${total.toFixed(2)}`)
    console.log('Products:', productList.map(p => p.name).join(', '))

  } catch (error) {
    console.error('❌ Error creating test order:', error)
  }
}

createTestOrder()
