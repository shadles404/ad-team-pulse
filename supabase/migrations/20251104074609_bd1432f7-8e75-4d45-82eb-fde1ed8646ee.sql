-- Add contract_type field to team_members table
ALTER TABLE public.team_members 
ADD COLUMN contract_type text;

-- Change advertisement_type to array to support multiple selections
ALTER TABLE public.team_members 
DROP COLUMN advertisement_type;

ALTER TABLE public.team_members 
ADD COLUMN advertisement_types text[] NOT NULL DEFAULT '{}';

-- Update existing rows to have at least empty array
UPDATE public.team_members 
SET advertisement_types = '{}' 
WHERE advertisement_types IS NULL;