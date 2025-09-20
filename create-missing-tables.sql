-- Create missing tables for the Hillside Logs Fuel application
-- Run this in your Supabase SQL Editor

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    replied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('USER', 'ADMIN')),
    message TEXT NOT NULL,
    thread_id INTEGER,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS contact_messages_replied_idx ON contact_messages(replied);
CREATE INDEX IF NOT EXISTS support_messages_user_id_idx ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS support_messages_thread_id_idx ON support_messages(thread_id);

-- Verify tables were created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('contact_messages', 'support_messages')
ORDER BY table_name, ordinal_position;