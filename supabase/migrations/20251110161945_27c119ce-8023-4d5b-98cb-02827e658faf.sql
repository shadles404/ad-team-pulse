-- Update deliveries table RLS policies to show all data to authenticated users
DROP POLICY IF EXISTS "Users and admins can view deliveries" ON public.deliveries;

CREATE POLICY "All authenticated users can view deliveries"
ON public.deliveries
FOR SELECT
TO authenticated
USING (true);

-- Update team_members table RLS policies to show all data to authenticated users
DROP POLICY IF EXISTS "Users can view their own team members" ON public.team_members;

CREATE POLICY "All authenticated users can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

-- Update team_members INSERT/UPDATE/DELETE policies to be admin-only
DROP POLICY IF EXISTS "Users can insert their own team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can update their own team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can delete their own team members" ON public.team_members;

CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));