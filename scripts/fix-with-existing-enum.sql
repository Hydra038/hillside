-- FIX for existing "OrderStatus" enum (uppercase)
-- Run this in Supabase SQL Editor

-- Option A: If status column is NOT using the OrderStatus enum
-- This converts a text/varchar column to use the existing OrderStatus enum
DO $$ 
DECLARE
    current_type text;
    current_udt text;
BEGIN
    SELECT data_type, udt_name INTO current_type, current_udt
    FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status';
    
    RAISE NOTICE 'Current type: %, UDT: %', current_type, current_udt;
    
    -- If it's text/varchar, convert to OrderStatus enum
    IF current_type IN ('character varying', 'text') THEN
        RAISE NOTICE 'Converting from % to OrderStatus enum...', current_type;
        
        -- First ensure data is lowercase
        UPDATE orders SET status = LOWER(status) WHERE status IS NOT NULL;
        
        -- Convert to enum
        ALTER TABLE orders 
            ALTER COLUMN status TYPE "OrderStatus" 
            USING status::"OrderStatus";
            
        RAISE NOTICE '✅ Successfully converted to OrderStatus enum';
        
    -- If it's already using OrderStatus
    ELSIF current_udt = 'OrderStatus' THEN
        RAISE NOTICE '✅ Column already using OrderStatus enum - no changes needed';
        
    -- If it's using a different enum
    ELSE
        RAISE NOTICE '❌ Column using different type: % (%)', current_type, current_udt;
    END IF;
END $$;

-- Verify the change
SELECT 
    '✅ VERIFICATION' as step,
    column_name,
    data_type,
    udt_name,
    CASE 
        WHEN udt_name = 'OrderStatus' THEN '✅ Correct! Using OrderStatus enum'
        ELSE '❌ Issue: Not using OrderStatus enum'
    END as status
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';

-- Show the enum values that are available
SELECT 
    '✅ Available Status Values' as info,
    enumlabel as value,
    enumsortorder as order_number
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
ORDER BY enumsortorder;
