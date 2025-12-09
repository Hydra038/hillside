# Fix Order Status Enum Error

## Problem
Getting error: `invalid input value for enum "OrderStatus": "pending"`

This means the database doesn't have the correct enum type set up for the `status` column in the `orders` table.

## Quick Fix - Option 1: Run SQL in Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor" in the left sidebar

2. **Run this SQL** (copy and paste):

```sql
-- Check if enum exists and create it if needed
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
        RAISE NOTICE 'Created order_status enum';
    END IF;
END $$;

-- Check current column type
DO $$ 
DECLARE
    current_type text;
BEGIN
    SELECT data_type INTO current_type
    FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status';
    
    RAISE NOTICE 'Current type: %', current_type;
END $$;

-- Convert the column to use the enum (if it's currently text/varchar)
ALTER TABLE orders 
    ALTER COLUMN status TYPE order_status 
    USING status::order_status;

-- Verify it worked
SELECT column_name, data_type, udt_name
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name = 'status';
```

3. **Click "Run"**

4. **Verify**: You should see output showing:
   - `column_name: status`
   - `data_type: USER-DEFINED`
   - `udt_name: order_status`

## Quick Fix - Option 2: Alternative (If enum exists but column isn't using it)

If the enum already exists but the column isn't using it:

```sql
-- Just convert the column
ALTER TABLE orders 
    ALTER COLUMN status TYPE order_status 
    USING status::order_status;
```

## Quick Fix - Option 3: If Column Doesn't Exist

If you're getting errors that the column doesn't exist:

```sql
-- Create the enum first
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- Then add the column
ALTER TABLE orders 
    ADD COLUMN status order_status DEFAULT 'pending';
```

## Verification

After running the fix, test by creating an order:
1. Go to your site's checkout page
2. Complete an order
3. If no error appears, it's fixed! ✅

## Common Issues

### Issue: "type order_status already exists"
**Solution**: The enum exists, just need to convert the column:
```sql
ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;
```

### Issue: "column status does not exist"
**Solution**: Add the column:
```sql
ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';
```

### Issue: "invalid input value"
**Solution**: Make sure existing data is lowercase:
```sql
UPDATE orders SET status = LOWER(status);
ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;
```

## Prevention

To prevent this in the future, make sure migrations are run properly:
1. Check `drizzle/0003_add_orders_tables.sql`
2. Run all migrations with: `npm run db:push` or `npx drizzle-kit push`

## Need Help?

If none of these work:
1. Check what type the column currently is:
   ```sql
   SELECT column_name, data_type, udt_name
   FROM information_schema.columns 
   WHERE table_name = 'orders';
   ```

2. Check if enum exists:
   ```sql
   SELECT typname FROM pg_type WHERE typname = 'order_status';
   ```

3. Share the output and we can troubleshoot further.
