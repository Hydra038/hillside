-- Update products with proper sizes, quantities, and SPECIAL OFFER PRICES!
-- Also set featured products to show the 2 special offers

-- First, remove all current featured flags
UPDATE products SET is_featured = false;

-- Product 1: Kiln Dried Oak
UPDATE products 
SET name = 'Kiln Dried Oak Logs - Large Net (40kg)',
    description = 'Premium British oak logs, kiln dried to <20% moisture content. Perfect for wood burners and open fires. Approximately 40kg per net. Ready to burn immediately with excellent heat output and long burn time.',
    price = 6.99,
    is_featured = true
WHERE id = 1;

-- Product 2: Mixed Hardwood Bulk Bag
UPDATE products 
SET name = 'Mixed Hardwood Logs - Bulk Bag (250kg)',
    description = 'A perfect mix of oak, ash, and beech for versatile burning. Kiln dried to <20% moisture. Approximately 250kg per bulk bag (around 0.7m³). Ideal for regular users with excellent value.',
    price = 45.00,
    is_featured = false
WHERE id = 2;

-- Product 3: Birch Small Net
UPDATE products 
SET name = 'Birch Logs - Small Net (20kg)',
    description = 'Beautiful white birch logs that burn cleanly with a pleasant aroma. Kiln dried to <20% moisture. Approximately 20kg per small net. Perfect for occasional fires.',
    price = 5.49,
    is_featured = false
WHERE id = 3;

-- Product 6: Kindling
UPDATE products 
SET name = 'British Pine Kindling - Net Bag (3kg)',
    description = 'Kiln dried British pine kindling in convenient net bag. <20% moisture content. Approximately 3kg per bag. Perfect for starting fires quickly and easily.',
    price = 4.99,
    is_featured = false
WHERE id = 6;

-- Product 11: ⭐ FEATURED SPECIAL OFFER - 1m³ for £50!
UPDATE products 
SET name = '🔥 SPECIAL OFFER - Mixed Hardwood Logs 1m³ Crate',
    description = '🎉 AMAZING DEAL! Mixed hardwood logs (oak, ash, beech) in wooden crate. Kiln dried to <20% moisture. 1 cubic meter (approx 350-400kg). SPECIAL OFFER PRICE: Only £50! Perfect for stocking up for winter. Limited time offer.',
    price = 50.00,
    is_featured = true
WHERE id = 11;

-- Product 14: Compressed Logs
UPDATE products 
SET name = 'Compressed Heat Logs - Box of 10',
    description = 'Eco-friendly compressed logs made from sawdust. Clean burning with high heat output. Box of 10 logs (approximately 12kg). Each log burns for 2-3 hours. Great alternative to traditional logs.',
    price = 18.99,
    is_featured = false
WHERE id = 14;

-- Product 20: Firelighters
UPDATE products 
SET name = 'Natural Firelighters - Box of 200',
    description = 'Chemical-free wood wool firelighters. Box of 200 pieces. Made from sustainable wood shavings and natural wax. Safe, effective, and eco-friendly way to start your fire.',
    price = 8.99,
    is_featured = false
WHERE id = 20;

-- Product 21: Smokeless Coal
UPDATE products 
SET name = 'Smokeless Coal - 25kg Bag',
    description = 'Premium smokeless coal approved for smoke control areas. Clean burning with long-lasting heat. 25kg bag. Ideal for overnight burning in multi-fuel stoves.',
    price = 22.50,
    is_featured = false
WHERE id = 21;

-- Product 22: Wood Pellets
UPDATE products 
SET name = 'Premium Wood Pellets - 15kg Bag',
    description = 'High-quality wood pellets for pellet stoves and biomass boilers. 15kg bag. Made from 100% compressed sawdust. <0.5% ash content. Efficient, clean burning fuel.',
    price = 9.99,
    is_featured = false
WHERE id = 22;

-- Product 23: Gift Box
UPDATE products 
SET name = 'Premium Firewood Gift Box - 30kg',
    description = 'Beautifully presented firewood gift box containing premium kiln dried logs (25kg), kindling (3kg), and natural firelighters (20 pieces). Perfect gift for wood burner owners.',
    price = 35.00,
    is_featured = false
WHERE id = 23;

-- Product 24: ⭐ FEATURED SPECIAL OFFER - 5m³ for £200!
UPDATE products 
SET name = '🔥 BULK SPECIAL OFFER - 5 Crates (5m³) Mixed Hardwood',
    description = '🎉 INCREDIBLE BULK DEAL! 5 wooden crates of mixed hardwood logs. Kiln dried to <20% moisture. Total 5 cubic meters (approximately 1.75 tonnes). SPECIAL OFFER: Only £200 (Save over £50!)! Delivered on pallet. Perfect for commercial use or heating large properties all winter. Limited time offer.',
    price = 200.00,
    is_featured = true
WHERE id = 24;

-- Product 25: Premium Mixed
UPDATE products 
SET name = 'Premium Mixed Logs - Large Net (40kg)',
    description = 'Premium selection of British hardwoods including oak, ash, and beech. Kiln dried to <20% moisture. Approximately 40kg per large net. Hand-selected larger logs for extended burn time.',
    price = 7.99,
    is_featured = false
WHERE id = 25;
