CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  location text,
  year text,
  category text NOT NULL DEFAULT 'landscape',
  tag text NOT NULL DEFAULT 'photography',
  image_url text NOT NULL,
  storage_path text,
  alt text,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_status ON public.gallery_photos(status);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_category ON public.gallery_photos(category);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user_id ON public.gallery_photos(user_id);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
