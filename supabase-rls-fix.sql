-- Enable RLS on all tables (run this in Supabase SQL Editor)

-- 1. USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" 
ON users FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 2. PRODUCTS TABLE  
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" 
ON products FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Only admins can modify products" ON products;
CREATE POLICY "Only admins can modify products" 
ON products FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- 3. ORDERS TABLE
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 4. ORDER_ITEMS TABLE
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" 
ON order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" 
ON order_items FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- 5. ACTIVITY TABLE
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own activity" ON activity;
CREATE POLICY "Users can view own activity" 
ON activity FOR SELECT 
USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Admins can view all activity" ON activity;
CREATE POLICY "Admins can view all activity" 
ON activity FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 6. PAYMENT_SETTINGS TABLE
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view enabled payment settings" ON payment_settings;
CREATE POLICY "Anyone can view enabled payment settings" 
ON payment_settings FOR SELECT 
USING (enabled = true);

DROP POLICY IF EXISTS "Only admins can modify payment settings" ON payment_settings;
CREATE POLICY "Only admins can modify payment settings" 
ON payment_settings FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- 7. SUPPORT_MESSAGES TABLE (if exists)
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own support messages" ON support_messages;
CREATE POLICY "Users can view own support messages" 
ON support_messages FOR SELECT 
USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Admins can view all support messages" ON support_messages;
CREATE POLICY "Admins can view all support messages" 
ON support_messages FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Success message
SELECT 'RLS enabled on all tables!' as result;