-- Create inquiries table
CREATE TABLE inquiries (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert inquiries
CREATE POLICY "Allow anonymous insert" ON inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users to view all inquiries
CREATE POLICY "Allow authenticated select" ON inquiries
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update inquiry status
CREATE POLICY "Allow authenticated update" ON inquiries
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true); 