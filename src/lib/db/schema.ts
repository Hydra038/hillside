import {
  pgTable,
  serial,
  varchar,
  decimal,
  integer,
  json,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  stockQuantity: integer('stock_quantity').notNull(),
  weight: decimal('weight', { precision: 10, scale: 2 }).notNull(),
  dimensions: json('dimensions').$type<{
    length: number;
    width: number;
    height: number;
  }>().notNull(),
  moisture: decimal('moisture', { precision: 5, scale: 2 }).notNull(),
  season: varchar('season', { length: 50 }).notNull(),
  features: json('features').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
