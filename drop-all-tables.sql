-- Drop all tables and clean up Supabase database
-- Execute this in your Supabase SQL Editor

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "support_messages" CASCADE;
DROP TABLE IF EXISTS "contact_messages" CASCADE;
DROP TABLE IF EXISTS "payment_settings" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Drop any other tables that might exist
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "ContactMessage" CASCADE;
DROP TABLE IF EXISTS "SupportMessage" CASCADE;
DROP TABLE IF EXISTS "PaymentSettings" CASCADE;
DROP TABLE IF EXISTS "FeaturedProduct" CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "MessageSender" CASCADE;

-- Drop any sequences that might have been created
DROP SEQUENCE IF EXISTS products_id_seq CASCADE;
DROP SEQUENCE IF EXISTS contact_messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS support_messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payment_settings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS order_items_id_seq CASCADE;

-- Success message
SELECT 'All tables and types have been dropped successfully! Ready for Prisma db push.' as message;
