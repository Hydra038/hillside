-- Enable Row Level Security for contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public inserts (for contact forms)
CREATE POLICY "Allow public inserts on contact_messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Optionally, create a policy for admins to read all messages
-- (you can modify this based on your authentication setup)
CREATE POLICY "Allow authenticated users to read contact_messages" 
ON contact_messages FOR SELECT 
USING (auth.role() = 'authenticated');