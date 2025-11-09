-- Add celebrity_id column to deliveries table
ALTER TABLE public.deliveries 
ADD COLUMN celebrity_id uuid REFERENCES public.team_members(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_deliveries_celebrity_id ON public.deliveries(celebrity_id);