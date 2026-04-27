-- Create additional tables for portfolio management system

-- Site Pages table for storing page metadata and content
CREATE TABLE IF NOT EXISTS public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  hero_image_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile table for user information
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  about TEXT,
  location TEXT,
  avatar_url TEXT,
  cv_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  youtube_url TEXT,
  twitter_url TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  proficiency TEXT CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CV files table
CREATE TABLE IF NOT EXISTS public.cv_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO settings table for managing SEO metadata per page
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_slug TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  robots_index BOOLEAN DEFAULT true,
  robots_follow BOOLEAN DEFAULT true,
  structured_data_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (optional, for multi-admin support)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_pages (public read)
CREATE POLICY "site_pages_select_published" ON public.site_pages FOR SELECT USING (status = 'published');
CREATE POLICY "site_pages_manage_authenticated" ON public.site_pages FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for profile (public read, owner write)
CREATE POLICY "profile_select_public" ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile_insert_own" ON public.profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profile_update_own" ON public.profile FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for skills (public read published, owner write)
CREATE POLICY "skills_select_published" ON public.skills FOR SELECT USING (status = 'published');
CREATE POLICY "skills_manage_own" ON public.skills FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for social_links (public read)
CREATE POLICY "social_links_select_public" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social_links_manage_own" ON public.social_links FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cv_files (owner only)
CREATE POLICY "cv_files_manage_own" ON public.cv_files FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for seo_settings (owner only)
CREATE POLICY "seo_settings_manage_own" ON public.seo_settings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for admin_users (authenticated read, superadmin write)
CREATE POLICY "admin_users_select_authenticated" ON public.admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_users_manage_superadmin" ON public.admin_users FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'superadmin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON public.site_pages(page_slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_status ON public.site_pages(status);
CREATE INDEX IF NOT EXISTS idx_profile_user_id ON public.profile(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_status ON public.skills(status);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON public.social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_files_user_id ON public.cv_files(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_settings_slug ON public.seo_settings(page_slug);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS site_pages_updated_at ON public.site_pages;
CREATE TRIGGER site_pages_updated_at BEFORE UPDATE ON public.site_pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS profile_updated_at ON public.profile;
CREATE TRIGGER profile_updated_at BEFORE UPDATE ON public.profile FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS skills_updated_at ON public.skills;
CREATE TRIGGER skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS social_links_updated_at ON public.social_links;
CREATE TRIGGER social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS cv_files_updated_at ON public.cv_files;
CREATE TRIGGER cv_files_updated_at BEFORE UPDATE ON public.cv_files FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS seo_settings_updated_at ON public.seo_settings;
CREATE TRIGGER seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS admin_users_updated_at ON public.admin_users;
CREATE TRIGGER admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
