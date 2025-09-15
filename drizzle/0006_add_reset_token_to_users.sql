-- Add reset_token and reset_token_expires columns to users table for password reset
ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
  ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;
