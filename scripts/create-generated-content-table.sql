-- Create generated_content table to store AI-generated content
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  paper_id UUID REFERENCES research_papers(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('presentation', 'podcast', 'summary', 'visual')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own generated content
CREATE POLICY "Users can view own generated content" ON generated_content
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own generated content
CREATE POLICY "Users can insert own generated content" ON generated_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own generated content
CREATE POLICY "Users can delete own generated content" ON generated_content
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX idx_generated_content_paper_id ON generated_content(paper_id);
CREATE INDEX idx_generated_content_type ON generated_content(content_type);
