import { type InferModel } from 'drizzle-orm'
import { products, users, orders, orderItems } from '@/lib/db/schema'

// Infer types from schemas
export type Product = InferModel<typeof products>
export type User = InferModel<typeof users>
export type Order = InferModel<typeof orders>
export type OrderItem = InferModel<typeof orderItems>
