ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_projects_details_gin
  ON public.projects USING GIN (details);

COMMENT ON COLUMN public.projects.details IS 'Category-specific project metadata such as civil project type, website name, gallery images, client name, feedback, and reactions.';
