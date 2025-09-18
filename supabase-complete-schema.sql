-- Complete Prisma Schema Implementation for Supabase
-- Run this in your Supabase SQL Editor to create all tables

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- User table
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "address" JSONB,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "emailVerificationTokenExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Product table
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "images" JSONB,
    "features" JSONB,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- Order table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "billingAddress" JSONB,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paymentPlan" TEXT,
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- OrderItem table
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- ContactMessage table
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- SupportMessage table
CREATE TABLE "SupportMessage" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "adminResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessage_pkey" PRIMARY KEY ("id")
);

-- PaymentSettings table
CREATE TABLE "PaymentSettings" (
    "id" SERIAL NOT NULL,
    "depositPercentage" DECIMAL(5,2) NOT NULL DEFAULT 25.00,
    "enablePaymentPlans" BOOLEAN NOT NULL DEFAULT true,
    "freeDeliveryThreshold" DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSettings_pkey" PRIMARY KEY ("id")
);

-- FeaturedProduct table
CREATE TABLE "FeaturedProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- NextAuth tables
CREATE TABLE "Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create unique indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Add foreign key constraints
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FeaturedProduct" ADD CONSTRAINT "FeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert comprehensive firewood products
INSERT INTO "Product" ("name", "description", "price", "category", "stockQuantity", "imageUrl", "features", "isFeatured", "createdAt", "updatedAt") VALUES
('Premium Oak Firewood', 'High-quality seasoned oak firewood, perfect for long-burning fires with excellent heat output. Ideal for wood stoves and fireplaces.', 89.99, 'hardwood', 50, '/images/oak-firewood.jpg', '{"burnTime": "4-6 hours", "heatOutput": "High", "moistureContent": "15-20%", "seasoned": true, "weight": "40 lbs per bundle"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Mixed Hardwood Bundle', 'A perfect mix of oak, maple, and birch for versatile burning needs. Great for both indoor and outdoor use.', 69.99, 'hardwood', 75, '/images/mixed-hardwood.jpg', '{"burnTime": "3-5 hours", "heatOutput": "Medium-High", "moistureContent": "18-22%", "variety": "Oak, Maple, Birch", "weight": "35 lbs per bundle"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Birch Firewood', 'Beautiful white birch logs that burn cleanly with a pleasant aroma. Perfect for special occasions.', 79.99, 'hardwood', 30, '/images/birch-firewood.jpg', '{"burnTime": "3-4 hours", "heatOutput": "Medium-High", "moistureContent": "16-20%", "aroma": "Pleasant", "appearance": "White bark"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Maple Firewood', 'Premium maple wood known for its excellent burning properties and sweet smoke aroma.', 85.99, 'hardwood', 40, '/images/maple-firewood.jpg', '{"burnTime": "4-5 hours", "heatOutput": "High", "moistureContent": "15-18%", "aroma": "Sweet", "density": "High"}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Cherry Firewood', 'Aromatic cherry wood that produces beautiful flames and pleasant smoke for outdoor cooking.', 95.99, 'hardwood', 25, '/images/cherry-firewood.jpg', '{"burnTime": "3-4 hours", "heatOutput": "Medium", "moistureContent": "18-22%", "aroma": "Fruity", "cookingWood": true}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Pine Kindling Pack', 'Easy-to-light pine kindling, perfect for starting fires quickly. Essential for any fire-starting kit.', 24.99, 'softwood', 100, '/images/pine-kindling.jpg', '{"burnTime": "30-60 minutes", "heatOutput": "Medium", "purpose": "Fire starting", "pieces": "50+ pieces", "weight": "15 lbs per bundle"}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Cedar Kindling', 'Premium cedar kindling that lights easily and burns hot. Perfect for starting stubborn fires.', 29.99, 'softwood', 80, '/images/cedar-kindling.jpg', '{"burnTime": "45-90 minutes", "heatOutput": "High", "purpose": "Fire starting", "pieces": "40+ pieces", "aroma": "Cedar"}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Pine Firewood', 'Affordable pine firewood perfect for outdoor fire pits and camping. Quick-burning with pleasant aroma.', 45.99, 'softwood', 60, '/images/pine-firewood.jpg', '{"burnTime": "2-3 hours", "heatOutput": "Medium", "moistureContent": "20-25%", "aroma": "Pine", "outdoor": true}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Seasoned Hickory', 'Premium hickory wood perfect for smoking and long-burning fires. Excellent for BBQ and cooking.', 99.99, 'hardwood', 20, '/images/hickory-firewood.jpg', '{"burnTime": "5-7 hours", "heatOutput": "Very High", "moistureContent": "12-16%", "smokingWood": true, "density": "Very High"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Apple Firewood', 'Sweet-smelling apple wood ideal for cooking and indoor fires. Burns clean with minimal smoke.', 89.99, 'fruitwood', 35, '/images/apple-firewood.jpg', '{"burnTime": "3-4 hours", "heatOutput": "Medium-High", "moistureContent": "16-20%", "aroma": "Apple", "cookingWood": true}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Bulk Mixed Hardwood - Half Cord', 'Large quantity mixed hardwood for serious fire enthusiasts. Perfect for entire season heating.', 299.99, 'hardwood', 10, '/images/bulk-hardwood.jpg', '{"burnTime": "Variable", "heatOutput": "High", "quantity": "Half cord", "variety": "Oak, Maple, Birch, Cherry", "delivery": "Required"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Fire Starter Bundle', 'Complete fire starting kit with kindling, newspaper logs, and fire starters. Everything you need!', 39.99, 'starter-kit', 50, '/images/fire-starter-bundle.jpg', '{"contents": "Kindling, fire starters, newspaper logs", "pieces": "Varied", "easyLight": true, "beginner": true}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Aged Oak - 2 Year Seasoned', 'Premium aged oak seasoned for 2 full years. The gold standard of firewood with minimal moisture.', 129.99, 'premium', 15, '/images/aged-oak.jpg', '{"burnTime": "6-8 hours", "heatOutput": "Maximum", "moistureContent": "8-12%", "seasoned": "2 years", "premium": true}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Compressed Fire Logs', 'Eco-friendly compressed logs made from sawdust. Clean burning with consistent heat output.', 34.99, 'manufactured', 90, '/images/compressed-logs.jpg', '{"burnTime": "2-3 hours", "heatOutput": "Consistent", "ecoFriendly": true, "lowAsh": true, "uniform": true}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Campfire Bundle', 'Perfect bundle for camping trips. Includes kindling and medium-sized logs for outdoor fires.', 49.99, 'camping', 70, '/images/campfire-bundle.jpg', '{"burnTime": "3-4 hours", "heatOutput": "Medium", "portable": true, "outdoor": true, "includes": "Kindling + logs"}', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert default payment settings
INSERT INTO "PaymentSettings" ("depositPercentage", "enablePaymentPlans", "freeDeliveryThreshold") 
VALUES (25.00, true, 50.00);

-- Create performance indexes
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_isFeatured_idx" ON "Product"("isFeatured");
CREATE INDEX "ContactMessage_isRead_idx" ON "ContactMessage"("isRead");
CREATE INDEX "SupportMessage_userId_idx" ON "SupportMessage"("userId");
CREATE INDEX "SupportMessage_status_idx" ON "SupportMessage"("status");
CREATE INDEX "FeaturedProduct_productId_idx" ON "FeaturedProduct"("productId");

SELECT 'Database schema created successfully! 15 firewood products added with complete e-commerce structure.' as message;