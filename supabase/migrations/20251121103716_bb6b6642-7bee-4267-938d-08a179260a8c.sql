-- Create payment_confirmations table
CREATE TABLE public.payment_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  celebrity_id uuid REFERENCES public.team_members(id) ON DELETE CASCADE,
  celebrity_name text NOT NULL,
  phone_number text NOT NULL,
  job_completed boolean NOT NULL DEFAULT true,
  salary numeric NOT NULL,
  confirmed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL
);

-- Enable RLS
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view payment confirmations
CREATE POLICY "All authenticated users can view payment confirmations"
ON public.payment_confirmations
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert payment confirmations
CREATE POLICY "Admins can create payment confirmations"
ON public.payment_confirmations
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update payment confirmations
CREATE POLICY "Admins can update payment confirmations"
ON public.payment_confirmations
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete payment confirmations
CREATE POLICY "Admins can delete payment confirmations"
ON public.payment_confirmations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_payment_confirmations_updated_at
  BEFORE UPDATE ON public.payment_confirmations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();