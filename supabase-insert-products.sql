-- Run this SQL in your Supabase Dashboard SQL Editor

INSERT INTO products (name, description, price, category, image_url, stock_quantity, season, features, is_featured, created_at, updated_at) VALUES
('Premium Oak Firewood', 'High-quality seasoned oak logs, perfect for long-burning fires with excellent heat output.', 89.99, 'hardwood', '/images/products/oak-logs.jpg', 50, 'winter', '["Seasoned 18+ months", "High heat output", "Long burning", "Clean burning"]', true, NOW(), NOW()),
('Mixed Hardwood Bundle', 'Premium mix of oak, ash, and beech. Ideal for wood burners and open fires.', 69.99, 'hardwood', '/images/products/premium-firewood.jpg', 75, 'all-season', '["Mixed hardwood", "Ready to burn", "Sustainable source", "Excellent value"]', true, NOW(), NOW()),
('Silver Birch Logs', 'Quick-lighting birch logs, perfect for kindling and getting fires started.', 45.99, 'softwood', '/images/products/seasoned-softwood-logs.webp', 60, 'all-season', '["Quick lighting", "Great for kindling", "Pleasant aroma", "Clean burning"]', false, NOW(), NOW()),
('Kiln Dried Ash Logs', 'Premium kiln-dried ash with moisture content below 20%. Ready to burn immediately.', 79.99, 'hardwood', '/images/products/ash-hardwood-logs.jpg', 40, 'winter', '["Kiln dried", "Below 20% moisture", "Immediate use", "Premium quality"]', true, NOW(), NOW()),
('Natural Firelighters', 'Chemical-free wood wool firelighters made from sustainable materials.', 12.99, 'accessories', '/images/products/firelighters.webp', 100, 'all-season', '["Chemical free", "Natural wood wool", "Easy ignition", "Eco-friendly"]', false, NOW(), NOW()),
('Pine Kindling Pack', 'Dry pine kindling sticks, perfect for starting fires quickly and easily.', 24.99, 'kindling', '/images/products/kindling-wood.png', 80, 'all-season', '["Dry kindling", "Quick lighting", "Perfect size", "Ready to use"]', false, NOW(), NOW()),
('Cherry Firewood', 'Sweet-scented cherry wood logs, perfect for BBQ and indoor fires.', 95.99, 'hardwood', '/images/products/premium-firewood.jpg', 25, 'all-season', '["Sweet aroma", "Great for cooking", "Premium hardwood", "Long burning"]', true, NOW(), NOW()),
('Bulk Hardwood Crate', 'Large crate of mixed hardwood logs for serious wood burner users.', 149.99, 'hardwood', '/images/products/bulk-hardwood-logs-crate.webp', 15, 'winter', '["Bulk quantity", "Mixed hardwood", "Great value", "Long lasting"]', true, NOW(), NOW());

-- Check if products were added
SELECT COUNT(*) as total_products FROM products;
SELECT name, price, is_featured FROM products ORDER BY is_featured DESC, created_at DESC;