import { pgTable, serial, text, numeric, integer, jsonb, timestamp, boolean, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Will be hashed
  role: userRoleEnum('role').notNull().default('user'),
  address: jsonb('address').$type<{
    street: string;
    city: string;
    postcode: string;
    country: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  category: text('category').notNull(),
  image_url: text('image_url'),
  stock_quantity: integer('stock_quantity').notNull().default(0),
  is_featured: boolean('is_featured').notNull().default(false),
  season: text('season'),
  features: jsonb('features').$type<string[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: orderStatusEnum('status').notNull().default('pending'),
  total: numeric('total').notNull(),
  shippingAddress: jsonb('shipping_address').$type<{
    street: string;
    city: string;
    postcode: string;
    country: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  priceAtTime: numeric('price_at_time').notNull(),
});

// Relations
export const paymentSettings = pgTable('payment_settings', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  enabled: boolean('enabled').notNull().default(true),
  config: jsonb('config').$type<any>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
