-- Remove one featured product
UPDATE products SET is_featured = 0 WHERE is_featured = 1 LIMIT 1;

-- Add new offer product: 5 tonnes for £200
INSERT INTO products (name, description, price, category, stock_quantity, is_featured)
VALUES ('5 Tonne Firewood Offer', 'Special offer: 5 tonnes of premium firewood for only £200.', 200.00, 'hardwood', 10, 1);
