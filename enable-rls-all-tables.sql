-- Enable Row Level Security for all tables
-- This script will enable RLS and create appropriate policies for each table

-- 1. USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first, then create new ones
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Admins can see all users
CREATE POLICY "Admins can view all users" 
ON users FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 2. PRODUCTS TABLE
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can view products (public access)
CREATE POLICY IF NOT EXISTS "Anyone can view products" 
ON products FOR SELECT 
USING (true);

-- Only admins can modify products
CREATE POLICY IF NOT EXISTS "Only admins can insert products" 
ON products FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Only admins can update products" 
ON products FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Only admins can delete products" 
ON products FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');

-- 3. ORDERS TABLE
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own orders
CREATE POLICY IF NOT EXISTS "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Users can create their own orders
CREATE POLICY IF NOT EXISTS "Users can create own orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Users can update their own orders (before processing)
CREATE POLICY IF NOT EXISTS "Users can update own orders" 
ON orders FOR UPDATE 
USING (auth.uid()::text = user_id::text AND status = 'pending');

-- Admins can see and modify all orders
CREATE POLICY IF NOT EXISTS "Admins can view all orders" 
ON orders FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can update all orders" 
ON orders FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

-- 4. ORDER_ITEMS TABLE
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can only see order items for their own orders
CREATE POLICY IF NOT EXISTS "Users can view own order items" 
ON order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id::text = auth.uid()::text
  )
);

-- Users can create order items for their own orders
CREATE POLICY IF NOT EXISTS "Users can create own order items" 
ON order_items FOR INSERT 
WITH CHECK (
  order_id IN (
    SELECT id FROM orders WHERE user_id::text = auth.uid()::text
  )
);

-- Admins can see and modify all order items
CREATE POLICY IF NOT EXISTS "Admins can view all order items" 
ON order_items FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY IF NOT EXISTS "Admins can modify all order items" 
ON order_items FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- 5. ACTIVITY TABLE
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- Users can only see their own activity
CREATE POLICY IF NOT EXISTS "Users can view own activity" 
ON activity FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- System can create activity for any user
CREATE POLICY IF NOT EXISTS "System can create activity" 
ON activity FOR INSERT 
WITH CHECK (true);

-- Admins can see all activity
CREATE POLICY IF NOT EXISTS "Admins can view all activity" 
ON activity FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 6. PAYMENT_SETTINGS TABLE
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view enabled payment settings
CREATE POLICY IF NOT EXISTS "Anyone can view enabled payment settings" 
ON payment_settings FOR SELECT 
USING (enabled = true);

-- Only admins can modify payment settings
CREATE POLICY IF NOT EXISTS "Only admins can modify payment settings" 
ON payment_settings FOR ALL 
USING (auth.jwt() ->> 'role' = 'admin');

-- 7. CONTACT_MESSAGES TABLE
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit contact messages (public contact form)
CREATE POLICY IF NOT EXISTS "Allow public inserts on contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY IF NOT EXISTS "Only admins can view contact messages" 
ON contact_messages FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- 8. SUPPORT_MESSAGES TABLE (if it exists)
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own support messages
CREATE POLICY IF NOT EXISTS "Users can view own support messages" 
ON support_messages FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Users can create their own support messages
CREATE POLICY IF NOT EXISTS "Users can create own support messages" 
ON support_messages FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can see all support messages
CREATE POLICY IF NOT EXISTS "Admins can view all support messages" 
ON support_messages FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- Admins can respond to support messages
CREATE POLICY IF NOT EXISTS "Admins can create support responses" 
ON support_messages FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Display success message
SELECT 'RLS enabled for all tables with appropriate policies!' as result;