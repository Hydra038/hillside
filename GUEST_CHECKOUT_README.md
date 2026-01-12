# Guest Checkout Feature

## Overview
This feature allows customers to complete purchases without creating an account. Guest orders are stored with the customer's contact information directly in the orders table.

## What's New

### Frontend Changes (`src/app/checkout/page.tsx`)
- **Guest/Login Choice Screen**: New UI that appears when users reach checkout without being logged in
  - Option to continue as guest with quick checkout
  - Option to sign in or create account for registered users
- **Guest Form Fields**: Added phone number field for guest checkouts
- **Guest Info Indicator**: Blue banner showing "You're checking out as a guest"
- **Seamless Experience**: Logged-in users skip the choice screen and go straight to checkout

### Backend Changes (`src/app/api/orders/route.ts`)
- **Guest Order Support**: API now accepts `guestCheckout` flag and `guestInfo` object
- **Flexible Authentication**: Orders can be created with or without authentication
- **Guest Data Storage**: Guest name, email, and phone are stored in dedicated columns
- **Email Confirmation**: Guest users receive order confirmation emails just like registered users

### Database Changes
Run this SQL in your Supabase SQL Editor:

```sql
-- Add guest checkout columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS guest_name TEXT,
ADD COLUMN IF NOT EXISTS guest_email TEXT,
ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- Make user_id nullable to allow guest orders
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Ensure either user_id or guest_email is present
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_user_or_guest_check;

ALTER TABLE orders
ADD CONSTRAINT orders_user_or_guest_check 
CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

-- Add index for guest email lookups
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email) 
WHERE guest_email IS NOT NULL;
```

## How It Works

### Guest Checkout Flow
1. User adds items to cart and goes to checkout
2. If not logged in, they see two options:
   - **Continue as Guest**: Quick checkout without account
   - **Sign In/Sign Up**: Access account features
3. Guest users fill in:
   - Full name
   - Email address
   - Phone number
   - Delivery address
   - Payment method
4. Order is created with `user_id = NULL` and guest info stored
5. Confirmation email sent to guest email address

### Registered User Checkout
1. User logs in before or during checkout
2. Form pre-fills with saved account information
3. Order is created with their `user_id`
4. Order appears in their account history

## Benefits

### For Customers
- ✅ **Faster Checkout**: No account creation required
- ✅ **Privacy**: No need to remember another password
- ✅ **Still Tracked**: Order confirmation via email
- ✅ **Optional Account**: Can create account later if desired

### For Business
- ✅ **Reduced Cart Abandonment**: Fewer friction points
- ✅ **More Conversions**: Lower barrier to purchase
- ✅ **Customer Data**: Still collect contact information
- ✅ **Email Marketing**: Can follow up with guest customers

## Data Structure

### Guest Orders
```typescript
{
  user_id: null,
  guest_name: "John Doe",
  guest_email: "john@example.com",
  guest_phone: "+44 7XXX XXXXXX",
  shipping_address: {...},
  payment_method: "bank_transfer",
  status: "pending",
  total: "150.00"
}
```

### Registered User Orders
```typescript
{
  user_id: 123,
  guest_name: null,
  guest_email: null,
  guest_phone: null,
  shipping_address: {...},
  payment_method: "bank_transfer",
  status: "pending",
  total: "150.00"
}
```

## Admin Dashboard Notes

Guest orders will appear in the admin panel with:
- Guest indicator (instead of user account link)
- Contact information displayed (guest_name, guest_email, guest_phone)
- All order management features work the same

## Future Enhancements

### Potential Features
- [ ] "Create account from order" feature using order email
- [ ] Guest order tracking via email link
- [ ] Remember guest info in browser (localStorage)
- [ ] Convert guest to registered user post-checkout
- [ ] Guest order history lookup by email

## Testing

### Test Guest Checkout
1. Clear cookies / use incognito mode
2. Add items to cart
3. Go to checkout
4. Click "Continue as Guest"
5. Fill in guest information
6. Complete order
7. Check email for confirmation

### Test Registered User
1. Sign in to account
2. Add items to cart
3. Go to checkout (should skip guest choice)
4. Complete order with pre-filled info
5. View order in account history

## Security Notes

- Guest emails are validated
- Phone numbers are required for delivery coordination
- No sensitive data stored beyond what's necessary
- Same email validation and order processing as registered users
- GDPR compliant - customers provide explicit consent

## Support

If you have questions about implementing or using guest checkout:
- Check order confirmation emails are being sent
- Verify Supabase columns are created correctly
- Test both guest and registered user flows
- Monitor conversion rates before/after implementation
