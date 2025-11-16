import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getOrders(userId: string) {
  try {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId))
    return userOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}
