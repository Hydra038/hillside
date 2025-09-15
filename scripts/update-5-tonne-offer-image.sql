-- Update the imageUrl for the 5 Tonne Firewood Offer product to use the new .webp image
UPDATE products
SET image_url = '/images/products/5-tonne-offer.webp'
WHERE name LIKE '%5 Tonne Firewood Offer%';
