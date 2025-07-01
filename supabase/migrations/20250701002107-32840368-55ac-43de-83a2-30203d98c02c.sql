
-- Create saved_parts table for storing user's saved car parts
CREATE TABLE public.saved_parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES public.car_parts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  list_name TEXT DEFAULT 'default',
  UNIQUE(user_id, part_id)
);

-- Enable RLS for saved_parts
ALTER TABLE public.saved_parts ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_parts
CREATE POLICY "Users can view their own saved parts" 
  ON public.saved_parts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save parts" 
  ON public.saved_parts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their saved parts" 
  ON public.saved_parts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved parts" 
  ON public.saved_parts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_saved_parts_user_id ON public.saved_parts(user_id);
CREATE INDEX idx_saved_parts_part_id ON public.saved_parts(part_id);
CREATE INDEX idx_saved_parts_created_at ON public.saved_parts(created_at DESC);
