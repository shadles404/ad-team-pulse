-- Create deliveries table
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  celebrity_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  date_sent TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own deliveries" 
ON public.deliveries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deliveries" 
ON public.deliveries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deliveries" 
ON public.deliveries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deliveries" 
ON public.deliveries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deliveries_updated_at
BEFORE UPDATE ON public.deliveries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();