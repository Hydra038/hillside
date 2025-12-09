-- SIMPLE FIX: Run this in Supabase SQL Editor
-- This will fix the "invalid input value for enum" error

-- Step 1: Create the enum type (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
    END IF;
END $$;

-- Step 2: Convert the status column to use the enum
-- This handles if column is text, varchar, or doesn't exist
DO $$ 
BEGIN
    -- Check if column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        -- Column exists, convert it
        ALTER TABLE orders 
            ALTER COLUMN status TYPE order_status 
            USING COALESCE(status::order_status, 'pending'::order_status);
    ELSE
        -- Column doesn't exist, create it
        ALTER TABLE orders 
            ADD COLUMN status order_status DEFAULT 'pending';
    END IF;
END $$;

-- Step 3: Verify it worked
SELECT 
    'SUCCESS: status column is now using order_status enum' as message,
    column_name, 
    data_type, 
    udt_name 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';
