-- Insert or update a Premium Firewood Box product for £49 with the provided image
INSERT INTO products (name, description, price, category, stock_quantity, is_featured, image_url, weight, dimensions, moisture, season, features)
VALUES (
  'Premium Firewood Box',
  'Box of kiln dried premium firewood, perfect for home use.',
  49.00,
  'Premium',
  20,
  1,
  '/images/products/premium-firewood-box.webp',
  20,
  '{"length": 40, "width": 40, "height": 40}',
  15,
  'Kiln Dried',
  '["Premium", "Box", "Kiln Dried", "Home Use"]'
)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  price = VALUES(price),
  category = VALUES(category),
  stock_quantity = VALUES(stock_quantity),
  is_featured = VALUES(is_featured),
  image_url = VALUES(image_url),
  weight = VALUES(weight),
  dimensions = VALUES(dimensions),
  moisture = VALUES(moisture),
  season = VALUES(season),
  features = VALUES(features);
