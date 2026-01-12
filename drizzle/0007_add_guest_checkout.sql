-- Add guest checkout columns to orders table
-- Run this in your Supabase SQL Editor

-- Add guest information columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Make user_id nullable to allow guest orders
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint to ensure either user_id or guest_email is present
-- This ensures every order is associated with either a registered user or a guest
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_user_or_guest_check;

ALTER TABLE orders
ADD CONSTRAINT orders_user_or_guest_check 
CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- Add index on guest_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email) 
WHERE guest_email IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN orders.guest_name IS 'Name of guest customer (when user_id is NULL)';
COMMENT ON COLUMN orders.guest_email IS 'Email of guest customer (when user_id is NULL)';
COMMENT ON COLUMN orders.guest_phone IS 'Phone number of guest customer (when user_id is NULL)';
