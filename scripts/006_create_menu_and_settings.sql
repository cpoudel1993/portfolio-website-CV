-- Menu items for the public navigation (managed by admin)
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  anchor TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_external BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  location TEXT NOT NULL DEFAULT 'main' CHECK (location IN ('main', 'footer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_location_sort ON public.menu_items(location, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON public.menu_items(is_active);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_items_select_active" ON public.menu_items;
CREATE POLICY "menu_items_select_active" ON public.menu_items
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "menu_items_manage_authenticated" ON public.menu_items;
CREATE POLICY "menu_items_manage_authenticated" ON public.menu_items
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS menu_items_updated_at ON public.menu_items;
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Site-wide key/value settings (managed by admin)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_public" ON public.site_settings;
CREATE POLICY "site_settings_select_public" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "site_settings_manage_authenticated" ON public.site_settings;
CREATE POLICY "site_settings_manage_authenticated" ON public.site_settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed default menu items (idempotent)
INSERT INTO public.menu_items (label, href, anchor, sort_order, is_external, is_active, location)
VALUES
  ('Home', '/', '#home', 10, false, true, 'main'),
  ('About', '/about', '#about', 20, false, true, 'main'),
  ('Experience', '/experience', '#experience', 30, false, true, 'main'),
  ('Skills', '/skills', '#skills', 40, false, true, 'main'),
  ('Projects', '/projects', NULL, 50, false, true, 'main'),
  ('Certifications', '/certifications', '#certifications', 60, false, true, 'main'),
  ('Gallery', '/gallery', '#gallery', 70, false, true, 'main'),
  ('Blog', '/blog', NULL, 80, false, true, 'main'),
  ('Contact', '/contact', '#contact', 90, false, true, 'main'),
  ('Kharcha', 'https://kharcha.poonamkarki.com.np/auth/login', NULL, 100, true, true, 'main')
ON CONFLICT DO NOTHING;

-- Seed default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_title', 'Chiranjivi Poudel | Portfolio', 'Browser tab and SEO title'),
  ('site_description', 'Civil Engineer | Full-Stack Developer | Based in New Zealand', 'Default meta description'),
  ('enable_blog', 'true', 'Show blog posts on the public site'),
  ('enable_contact_form', 'true', 'Allow visitors to send messages'),
  ('enable_analytics', 'true', 'Track visitor analytics'),
  ('contact_email', 'c.poudel1993@gmail.com', 'Public contact email')
ON CONFLICT (key) DO NOTHING;
