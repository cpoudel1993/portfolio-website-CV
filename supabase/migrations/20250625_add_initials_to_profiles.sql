-- Add initials column to profiles table
ALTER TABLE public.profiles
ADD COLUMN initials VARCHAR(10) DEFAULT 'CP';

-- Add comment
COMMENT ON COLUMN public.profiles.initials IS 'Brand initials displayed in footer and navigation (e.g., CP)';
