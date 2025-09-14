-- Migration: Add payment_method and payment_plan columns to orders table
ALTER TABLE orders
  ADD COLUMN payment_method VARCHAR(255) NULL,
  ADD COLUMN payment_plan VARCHAR(255) NULL;
