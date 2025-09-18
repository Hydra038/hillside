-- Insert Firewood Products into Supabase Database
-- Execute this in your Supabase SQL Editor after creating the schema

-- Insert all firewood products
INSERT INTO "Product" (
    "name", 
    "description", 
    "price", 
    "category", 
    "stockQuantity", 
    "imageUrl", 
    "features", 
    "isFeatured"
) VALUES 

-- 1. Premium Oak Logs
(
    'Premium Oak Logs',
    'High-quality seasoned oak logs perfect for fireplaces and wood burners. Burns clean with excellent heat output.',
    45.99,
    'Hardwood',
    50,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    '["Premium Quality", "Seasoned", "High Heat Output", "25kg weight", "40cm length", "15% moisture content"]'::jsonb,
    true
),

-- 2. Mixed Hardwood Bundle
(
    'Mixed Hardwood Bundle',
    'A variety of seasoned hardwoods including ash, beech, and birch. Great value for money with consistent burning properties.',
    38.50,
    'Hardwood',
    75,
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80',
    '["Mixed Woods", "Great Value", "Versatile", "20kg weight", "35cm length", "18% moisture content"]'::jsonb,
    true
),

-- 3. Birch Logs - Small
(
    'Birch Logs - Small',
    'Beautiful birch logs with distinctive white bark. Perfect for kindling and smaller fires.',
    25.00,
    'Kindling',
    100,
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&q=80',
    '["White Bark", "Small Size", "Perfect for Kindling", "10kg weight", "25cm length", "20% moisture content"]'::jsonb,
    false
),

-- 4. Ash Logs - Large
(
    'Ash Logs - Large',
    'Premium ash logs that burn hot and clean. Ideal for overnight burning in larger stoves.',
    52.99,
    'Hardwood',
    30,
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=80',
    '["Large Size", "Long Burning", "Clean Burn", "30kg weight", "50cm length", "15% moisture content"]'::jsonb,
    true
),

-- 5. Kindling Bundle
(
    'Kindling Bundle',
    'Dry kindling wood perfect for starting fires. Essential for any wood burning setup.',
    12.99,
    'Kindling',
    200,
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&q=80',
    '["Extra Dry", "Fire Starter", "Essential", "5kg weight", "20cm length", "12% moisture content"]'::jsonb,
    false
),

-- 6. Beech Logs - Premium
(
    'Beech Logs - Premium',
    'Top quality beech logs that burn slowly and evenly. Excellent for long-lasting fires.',
    48.75,
    'Hardwood',
    40,
    'https://images.unsplash.com/photo-1515378791036-0648a814e3e6?w=500&q=80',
    '["Slow Burning", "Even Heat", "Premium Grade", "25kg weight", "45cm length", "16% moisture content"]'::jsonb,
    true
),

-- 7. 5 Tonnes Mixed Hardwood - Special Offer (FEATURED)
(
    '5 Tonnes Mixed Hardwood - Special Offer',
    'AMAZING OFFER! 5 tonnes of premium mixed hardwood including oak, ash, beech, and birch. Perfect for the whole winter season. Properly seasoned and ready to burn. Massive savings compared to buying individual bundles!',
    200.00,
    'Special Offers',
    25,
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
    '["Massive 5-tonne quantity", "Premium mixed hardwood species", "Kiln dried to below 20% moisture", "Ready to burn immediately", "Sustainably sourced from UK forests", "Free delivery within 25 miles", "Logs cut to 25cm lengths", "Bulk pricing exceptional value"]'::jsonb,
    true
);

-- Add some additional featured products to the FeaturedProduct table
INSERT INTO "FeaturedProduct" ("productId", "displayOrder", "isActive")
SELECT "id", 1, true FROM "Product" WHERE "name" = '5 Tonnes Mixed Hardwood - Special Offer'
UNION ALL
SELECT "id", 2, true FROM "Product" WHERE "name" = 'Premium Oak Logs'
UNION ALL
SELECT "id", 3, true FROM "Product" WHERE "name" = 'Mixed Hardwood Bundle'
UNION ALL
SELECT "id", 4, true FROM "Product" WHERE "name" = 'Ash Logs - Large';

-- Create an admin user (optional - use your own email and password)
INSERT INTO "User" (
    "name", 
    "email", 
    "password", 
    "role",
    "emailVerified"
) VALUES (
    'Admin User',
    'admin@firewood.com',
    '$2b$10$K1wbxqm.BVqmqT8mZrVFJeJ8UZd7Vzr2d9QYv8rLx4p9VnR5DxAGK', -- This is 'admin123' hashed
    'ADMIN',
    true
);

-- Success message
SELECT 
    COUNT(*) as total_products,
    'Products inserted successfully! Your firewood e-commerce database is ready.' as message
FROM "Product";
