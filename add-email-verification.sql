-- Add email verification fields to users table
ALTER TABLE users 
ADD COLUMN email_verified TINYINT NOT NULL DEFAULT 0,
ADD COLUMN email_verification_token VARCHAR(255),
ADD COLUMN email_verification_expires DATETIME;
