-- Create research_papers table to store uploaded papers and analysis
CREATE TABLE IF NOT EXISTS research_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  content_preview TEXT,
  analysis_result JSONB,
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own papers
CREATE POLICY "Users can view own papers" ON research_papers
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own papers
CREATE POLICY "Users can insert own papers" ON research_papers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own papers
CREATE POLICY "Users can update own papers" ON research_papers
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own papers
CREATE POLICY "Users can delete own papers" ON research_papers
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_research_papers_updated_at
  BEFORE UPDATE ON research_papers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_research_papers_user_id ON research_papers(user_id);
CREATE INDEX idx_research_papers_created_at ON research_papers(created_at DESC);
