-- UPDATED FIX: Handle existing "OrderStatus" enum
-- Run this in Supabase SQL Editor

-- Step 1: Check what we have
DO $$ 
BEGIN
    -- Show current status
    RAISE NOTICE '=== Current Database Status ===';
    
    -- Check for OrderStatus (uppercase)
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        RAISE NOTICE 'Found existing enum: OrderStatus (uppercase)';
    END IF;
    
    -- Check for order_status (lowercase)
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        RAISE NOTICE 'Found existing enum: order_status (lowercase)';
    END IF;
END $$;

-- Step 2: Check current column type
SELECT 
    column_name,
    data_type,
    udt_name,
    CASE 
        WHEN data_type = 'USER-DEFINED' THEN '✅ Using enum type: ' || udt_name
        ELSE '❌ NOT using enum, currently: ' || data_type
    END as status_info
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';

-- Step 3: Show enum values if they exist
DO $$
BEGIN
    -- Try to show OrderStatus values
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
        RAISE NOTICE 'OrderStatus enum values:';
        PERFORM enumlabel FROM pg_enum WHERE enumtypid = 'OrderStatus'::regtype;
    END IF;
    
    -- Try to show order_status values
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        RAISE NOTICE 'order_status enum values:';
        PERFORM enumlabel FROM pg_enum WHERE enumtypid = 'order_status'::regtype;
    END IF;
END $$;

-- Step 4: Show all enum values for both types (if they exist)
SELECT 
    'OrderStatus' as enum_type,
    enumlabel as value,
    enumsortorder as sort_order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
ORDER BY enumsortorder

UNION ALL

SELECT 
    'order_status' as enum_type,
    enumlabel as value,
    enumsortorder as sort_order
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'order_status')
ORDER BY enumsortorder;

-- INSTRUCTIONS:
-- 1. Run this script first to see what exists
-- 2. Check the output to see which enum is being used
-- 3. Then run the appropriate fix script based on the results
