-- Create recent_views table to track user's viewed parts
CREATE TABLE public.recent_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES public.car_parts(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one entry per user-part combination
  UNIQUE(user_id, part_id)
);

-- Enable Row Level Security
ALTER TABLE public.recent_views ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own recent views" 
ON public.recent_views 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recent views" 
ON public.recent_views 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recent views" 
ON public.recent_views 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recent views" 
ON public.recent_views 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_recent_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recent_views_updated_at
BEFORE UPDATE ON public.recent_views
FOR EACH ROW
EXECUTE FUNCTION public.update_recent_views_updated_at();

-- Create index for better performance
CREATE INDEX idx_recent_views_user_viewed_at ON public.recent_views(user_id, viewed_at DESC);

-- Function to add or update recent view (upsert)
CREATE OR REPLACE FUNCTION public.add_recent_view(user_id_param UUID, part_id_param UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.recent_views (user_id, part_id, viewed_at)
  VALUES (user_id_param, part_id_param, now())
  ON CONFLICT (user_id, part_id)
  DO UPDATE SET 
    viewed_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;