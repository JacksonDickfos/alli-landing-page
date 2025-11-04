# Supabase Setup Instructions for Articles

## Step 1: Create the Articles Table in Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL to create the `articles` table:

```sql
-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Alli Nutrition Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read articles
CREATE POLICY "Anyone can read articles" ON articles
    FOR SELECT
    USING (true);

-- Create policy to allow insert (you may want to restrict this to authenticated users)
-- For now, we'll allow public inserts since admin auth is handled by password
CREATE POLICY "Allow public inserts" ON articles
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow updates (you may want to restrict this to authenticated users)
CREATE POLICY "Allow public updates" ON articles
    FOR UPDATE
    USING (true);

-- Optional: Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 2: Verify Table Creation

1. Go to **Table Editor** in Supabase dashboard
2. You should see the `articles` table
3. The table should have the following columns:
   - `id` (bigint, primary key)
   - `title` (text)
   - `description` (text)
   - `image_url` (text, nullable)
   - `content` (text)
   - `author` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Step 3: Test the Integration

1. Refresh your resources page
2. The placeholder articles should automatically seed to Supabase
3. Create a new article - it should save to Supabase
4. Reload the page - your article should persist

## Notes

- The code automatically falls back to localStorage if Supabase is unavailable
- Articles are synced between Supabase and localStorage as backup
- All CRUD operations (Create, Read, Update) now use Supabase
- The table uses Row Level Security (RLS) but allows public read/write for now
- You can restrict INSERT/UPDATE policies to authenticated users later if needed

