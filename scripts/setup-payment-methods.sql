-- Clean up payment methods and keep only Bank Transfer and PayPal

-- Delete old payment methods
DELETE FROM payment_settings WHERE type IN ('cash', 'card', 'invoice');

-- Update Bank Transfer to ensure it's correct
UPDATE payment_settings 
SET 
  display_name = 'Bank Transfer (BACS)',
  description = 'Direct bank transfer to our business account',
  enabled = true
WHERE type = 'bank_transfer';

-- Add PayPal Friends & Family option
INSERT INTO payment_settings (type, display_name, description, enabled, config)
VALUES (
  'paypal',
  'PayPal (Friends & Family)',
  'Send payment via PayPal Friends & Family - No fees',
  true,
  '{"email": "your-paypal@email.com", "instructions": "Please send payment as Friends & Family to avoid fees. Include your order number in the notes."}'::jsonb
)
ON CONFLICT (type) DO UPDATE
SET 
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  config = EXCLUDED.config;
