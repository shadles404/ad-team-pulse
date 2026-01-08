-- Add new columns to payment_confirmations for monthly tracking
ALTER TABLE public.payment_confirmations
ADD COLUMN IF NOT EXISTS month INTEGER,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS completion_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS contract_reference TEXT;

-- Update existing records with current month/year
UPDATE public.payment_confirmations 
SET month = EXTRACT(MONTH FROM confirmed_at)::INTEGER,
    year = EXTRACT(YEAR FROM confirmed_at)::INTEGER
WHERE month IS NULL;