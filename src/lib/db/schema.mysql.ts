export const support_messages = mysqlTable('support_messages', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  sender: mysqlEnum('sender', ['user', 'admin']).notNull(),
  message: text('message').notNull(),
  created_at: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  thread_id: int('thread_id'),
});
export const contact_messages = mysqlTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  created_at: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  replied: tinyint('replied').notNull().default(0),
  reply_message: text('reply_message'),
  replied_at: datetime('replied_at'),
});
import { mysqlTable, serial, varchar, text, decimal, int, json, datetime, tinyint, mysqlEnum, boolean } from 'drizzle-orm/mysql-core';
import { sql, relations } from 'drizzle-orm';

export const userRoleEnum = mysqlEnum('user_role', ['user', 'admin']);

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID as varchar
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  address: json('address'),
  emailVerified: tinyint('email_verified').notNull().default(0),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  emailVerificationExpires: datetime('email_verification_expires'),
  reset_token: varchar('reset_token', { length: 255 }),
  reset_token_expires: datetime('reset_token_expires'),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const products = mysqlTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  image_url: varchar('image_url', { length: 255 }),
  stock_quantity: int('stock_quantity').notNull().default(0),
  season: varchar('season', { length: 255 }),
  features: json('features'),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const orderStatusEnum = mysqlEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);

export const orders = mysqlTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(), // UUID as varchar
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  status: mysqlEnum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']).notNull().default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json('shipping_address'),
  paymentMethod: varchar('payment_method', { length: 255 }),
  paymentPlan: varchar('payment_plan', { length: 32 }),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const orderItems = mysqlTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: varchar('order_id', { length: 36 }).notNull().references(() => orders.id),
  productId: int('product_id').notNull().references(() => products.id),
  quantity: int('quantity').notNull(),
  priceAtTime: decimal('price_at_time', { precision: 10, scale: 2 }).notNull()
});

export const paymentSettings = mysqlTable('payment_settings', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  description: text('description'),
  enabled: tinyint('enabled').notNull().default(1),
  config: json('config').notNull(),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const activity = mysqlTable('activity', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  type: varchar('type', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: datetime('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
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
