-- Enable realtime for all admin tables
-- This allows live updates when data changes

-- Enable realtime publication for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.experiences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;
