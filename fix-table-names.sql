-- Fix table names to match Prisma schema mapping
-- Run this in your Supabase SQL Editor to rename tables

-- Rename tables to match Prisma @@map() directives
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "Product" RENAME TO "products";
ALTER TABLE "Order" RENAME TO "orders";
ALTER TABLE "OrderItem" RENAME TO "order_items";
ALTER TABLE "ContactMessage" RENAME TO "contact_messages";
ALTER TABLE "SupportMessage" RENAME TO "support_messages";
ALTER TABLE "PaymentSettings" RENAME TO "payment_settings";
ALTER TABLE "FeaturedProduct" RENAME TO "featured_products";
ALTER TABLE "Account" RENAME TO "accounts";
ALTER TABLE "Session" RENAME TO "sessions";
ALTER TABLE "VerificationToken" RENAME TO "verification_tokens";

-- Rename column names in products table to match Prisma field mapping
ALTER TABLE "products" RENAME COLUMN "stockQuantity" TO "stock_quantity";
ALTER TABLE "products" RENAME COLUMN "imageUrl" TO "image_url";
ALTER TABLE "products" RENAME COLUMN "isFeatured" TO "is_featured";
ALTER TABLE "products" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updated_at";

-- Rename column names in users table
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";

-- Update foreign key references
ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "orders" RENAME COLUMN "totalAmount" TO "total";
ALTER TABLE "orders" RENAME COLUMN "shippingAddress" TO "shipping_address";
ALTER TABLE "orders" RENAME COLUMN "billingAddress" TO "billing_address";
ALTER TABLE "orders" RENAME COLUMN "paymentStatus" TO "payment_status";
ALTER TABLE "orders" RENAME COLUMN "paymentMethod" TO "payment_method";
ALTER TABLE "orders" RENAME COLUMN "paymentPlan" TO "payment_plan";
ALTER TABLE "orders" RENAME COLUMN "stripeSessionId" TO "stripe_session_id";
ALTER TABLE "orders" RENAME COLUMN "stripePaymentIntentId" TO "stripe_payment_intent_id";
ALTER TABLE "orders" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "orders" RENAME COLUMN "updatedAt" TO "updated_at";

-- Update order_items columns
ALTER TABLE "order_items" RENAME COLUMN "orderId" TO "order_id";
ALTER TABLE "order_items" RENAME COLUMN "productId" TO "product_id";
ALTER TABLE "order_items" RENAME COLUMN "createdAt" TO "created_at";

-- Update accounts table
ALTER TABLE "accounts" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "accounts" RENAME COLUMN "providerAccountId" TO "provider_account_id";

-- Update sessions table
ALTER TABLE "sessions" RENAME COLUMN "sessionToken" TO "session_token";
ALTER TABLE "sessions" RENAME COLUMN "userId" TO "user_id";

SELECT 'Table and column names updated to match Prisma schema mapping!' as message;