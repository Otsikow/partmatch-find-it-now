-- Create table for tracking buyer-seller follows
CREATE TABLE public.seller_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, seller_id)
);

-- Enable Row Level Security
ALTER TABLE public.seller_follows ENABLE ROW LEVEL SECURITY;

-- Create policies for seller_follows
CREATE POLICY "Buyers can follow sellers" 
ON public.seller_follows 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can unfollow sellers" 
ON public.seller_follows 
FOR DELETE 
USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can view their follows" 
ON public.seller_follows 
FOR SELECT 
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their followers" 
ON public.seller_follows 
FOR SELECT 
USING (auth.uid() = seller_id);

-- Create indexes for better performance
CREATE INDEX idx_seller_follows_buyer_id ON public.seller_follows(buyer_id);
CREATE INDEX idx_seller_follows_seller_id ON public.seller_follows(seller_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_seller_follows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seller_follows_updated_at
  BEFORE UPDATE ON public.seller_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_seller_follows_updated_at();