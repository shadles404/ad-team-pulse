-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add delivery_price column to deliveries table
ALTER TABLE public.deliveries
ADD COLUMN delivery_price NUMERIC(10, 2) DEFAULT 0;

-- Update RLS policies for deliveries to include admin access
DROP POLICY IF EXISTS "Users can view their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can create their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can update their own deliveries" ON public.deliveries;
DROP POLICY IF EXISTS "Users can delete their own deliveries" ON public.deliveries;

-- New policies with admin access
CREATE POLICY "Users and admins can view deliveries"
ON public.deliveries
FOR SELECT
USING (
  auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can create deliveries"
ON public.deliveries
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update deliveries"
ON public.deliveries
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete deliveries"
ON public.deliveries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));