-- Add "pending" to OrderStatus enum if it's missing
-- Run this in Supabase SQL Editor

-- Step 1: Check what values currently exist in the OrderStatus enum
SELECT 
    '=== Current OrderStatus Values ===' as info,
    enumlabel as value,
    enumsortorder as position
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
ORDER BY enumsortorder;

-- Step 2: Add "pending" if it doesn't exist
DO $$ 
BEGIN
    -- Check if "pending" value exists in OrderStatus enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'pending'
    ) THEN
        -- Add "pending" to the enum
        ALTER TYPE "OrderStatus" ADD VALUE 'pending';
        RAISE NOTICE '✅ Added "pending" to OrderStatus enum';
    ELSE
        RAISE NOTICE '✅ "pending" already exists in OrderStatus enum';
    END IF;
    
    -- Check for other common values and add if missing
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'processing'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'processing';
        RAISE NOTICE '✅ Added "processing" to OrderStatus enum';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'shipped'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'shipped';
        RAISE NOTICE '✅ Added "shipped" to OrderStatus enum';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'delivered'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'delivered';
        RAISE NOTICE '✅ Added "delivered" to OrderStatus enum';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'cancelled'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'cancelled';
        RAISE NOTICE '✅ Added "cancelled" to OrderStatus enum';
    END IF;
END $$;

-- Step 3: Verify all values are now present
SELECT 
    '=== Updated OrderStatus Values ===' as info,
    enumlabel as value,
    enumsortorder as position
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
ORDER BY enumsortorder;

-- Step 4: Make sure the orders.status column is using this enum
DO $$ 
DECLARE
    current_udt text;
BEGIN
    SELECT udt_name INTO current_udt
    FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status';
    
    IF current_udt = 'OrderStatus' THEN
        RAISE NOTICE '✅ orders.status is correctly using OrderStatus enum';
    ELSE
        RAISE NOTICE '❌ orders.status is using: % (should be OrderStatus)', current_udt;
        RAISE NOTICE 'Run the fix-with-existing-enum.sql script to fix this';
    END IF;
END $$;
