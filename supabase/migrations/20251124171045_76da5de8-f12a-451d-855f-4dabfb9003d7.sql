-- Add video_links column to team_members table
ALTER TABLE public.team_members
ADD COLUMN video_links text[] DEFAULT '{}';

-- Update existing records to have empty arrays matching their target_videos
UPDATE public.team_members
SET video_links = array_fill(''::text, ARRAY[target_videos])
WHERE video_links = '{}';
