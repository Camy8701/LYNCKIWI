-- Create messages table for contact form submissions
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    read_by UUID REFERENCES auth.users(id),
    notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_email ON public.messages(email);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (contact form submissions)
CREATE POLICY "Anyone can insert messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only authenticated users (admins) can view
CREATE POLICY "Only authenticated users can view messages"
    ON public.messages
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users (admins) can update
CREATE POLICY "Only authenticated users can update messages"
    ON public.messages
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users (admins) can delete
CREATE POLICY "Only authenticated users can delete messages"
    ON public.messages
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.messages IS 'Stores contact form submissions from website visitors';
