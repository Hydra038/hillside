-- Fix order_status enum issue
-- Run this in Supabase SQL Editor if you're getting enum errors

-- Step 1: Check if the enum exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        -- Create the enum if it doesn't exist
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        RAISE NOTICE 'Created order_status enum';
    ELSE
        RAISE NOTICE 'order_status enum already exists';
    END IF;
END $$;

-- Step 2: Check current column type of status in orders table
DO $$ 
DECLARE
    current_type text;
BEGIN
    SELECT data_type INTO current_type
    FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status';
    
    RAISE NOTICE 'Current status column type: %', current_type;
    
    -- If it's not using the enum, convert it
    IF current_type = 'character varying' OR current_type = 'text' THEN
        RAISE NOTICE 'Converting status column to use order_status enum...';
        
        -- First, ensure all existing values are valid
        UPDATE orders 
        SET status = LOWER(status)
        WHERE status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
        
        -- Convert column to enum type
        ALTER TABLE orders 
            ALTER COLUMN status TYPE order_status 
            USING status::order_status;
            
        RAISE NOTICE 'Successfully converted status column to order_status enum';
    ELSIF current_type = 'USER-DEFINED' THEN
        RAISE NOTICE 'Status column is already using an enum type';
    END IF;
END $$;

-- Step 3: Verify the change
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';

-- Step 4: Show all enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'order_status'::regtype
ORDER BY enumsortorder;
