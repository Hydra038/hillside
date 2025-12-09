# Fix "invalid input value for enum OrderStatus: pending" Error

## The Problem
Your database has an enum called `"OrderStatus"` (uppercase) but it's missing the "pending" value.

## Quick Fix (Run these in Supabase SQL Editor)

### Step 1: Diagnose (Optional but Recommended)
Run `scripts/diagnose-order-status.sql` to see what's currently set up.

### Step 2: Add Missing Enum Values
Run this SQL in Supabase SQL Editor:

```sql
-- Add missing values to OrderStatus enum
DO $$ 
BEGIN
    -- Add "pending"
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'pending'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'pending';
        RAISE NOTICE '✅ Added "pending"';
    END IF;
    
    -- Add "processing"
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'processing'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'processing';
        RAISE NOTICE '✅ Added "processing"';
    END IF;
    
    -- Add "shipped"
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'shipped'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'shipped';
        RAISE NOTICE '✅ Added "shipped"';
    END IF;
    
    -- Add "delivered"
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'delivered'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'delivered';
        RAISE NOTICE '✅ Added "delivered"';
    END IF;
    
    -- Add "cancelled"
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
        AND enumlabel = 'cancelled'
    ) THEN
        ALTER TYPE "OrderStatus" ADD VALUE 'cancelled';
        RAISE NOTICE '✅ Added "cancelled"';
    END IF;
END $$;

-- Verify
SELECT enumlabel as "✅ Available Values"
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'OrderStatus')
ORDER BY enumsortorder;
```

### Step 3: Verify Column is Using Enum
```sql
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';
```

**Expected Result:**
- `data_type`: USER-DEFINED
- `udt_name`: OrderStatus

### Step 4: Test
Try placing an order again. The error should be gone! ✅

## Alternative Scripts Available

I've created several helper scripts in the `scripts/` folder:

1. **`diagnose-order-status.sql`** - Shows what's currently configured
2. **`add-pending-to-enum.sql`** - Adds all missing enum values (RECOMMENDED - run this!)
3. **`fix-with-existing-enum.sql`** - Converts text column to use OrderStatus enum
4. **`fix-order-status-simple.sql`** - Creates lowercase enum (not needed in your case)

## Recommended Action

**Just run `scripts/add-pending-to-enum.sql` in Supabase SQL Editor** - it handles everything automatically!

## What This Does

1. Checks if "pending", "processing", "shipped", "delivered", "cancelled" exist in OrderStatus enum
2. Adds any missing values
3. Verifies the column is using the correct enum type
4. Shows you the current configuration

## After Running

You should see output like:
```
✅ Added "pending" to OrderStatus enum
✅ orders.status is correctly using OrderStatus enum

Available Values:
- pending
- processing
- shipped
- delivered
- cancelled
```

Then your checkout will work! 🎉
