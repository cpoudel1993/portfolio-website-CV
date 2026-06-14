export interface HomepageContent {
  // Hero
  heroBadge: string
  heroNameFirst: string
  heroNameLast: string
  heroRole: string
  heroDescription: string
  heroBackgroundUrl: string
  heroProfileImage: string
  heroCvUrl: string
  heroPrimaryCtaLabel: string
  // About
  aboutHeading: string
  aboutImage: string
  aboutParagraph1: string
  aboutParagraph2: string
}

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroBadge: 'Hamilton, Waikato, New Zealand',
  heroNameFirst: 'Chiranjivi',
  heroNameLast: 'Poudel',
  heroRole: 'Process Worker · Civil Engineer · Surveyor',
  heroDescription:
    'Reliable and hardworking professional with full-time New Zealand employment experience. Currently a Process Worker at Silver Fern Farms, Te Aroha, with a strong background in civil engineering, surveying, and site supervision.',
  heroBackgroundUrl: '/images/anime-mountain-bg-1.jpg',
  heroProfileImage: '/images/chiranjivi-formal.png',
  heroCvUrl:
    'https://drive.google.com/drive/folders/11gfMOdsckoZaRyZvVU75R3ZdVn9-BOWG?usp=sharing',
  heroPrimaryCtaLabel: 'View Experience',
  aboutHeading: 'About Chiranjivi Poudel',
  aboutImage: '/images/chiranjivi-casual.png',
  aboutParagraph1:
    'I am a reliable and hardworking professional currently based in Hamilton, Waikato, New Zealand. With full-time employment experience in the New Zealand meat processing industry, I bring a strong understanding of food safety, hygiene, and health and safety standards.',
  aboutParagraph2:
    'My background spans civil engineering, topographic and construction surveying, architectural drafting, and site supervision across multiple projects in Nepal. I am committed to long-term, dependable contribution across production, construction, or customer-focused roles. I hold a Diploma in Civil Engineering and am eligible to work full-time in New Zealand.',
}

/**
 * Maps the keys used in the `site_settings` table to the typed HomepageContent
 * object, falling back to defaults whenever a value is missing or blank.
 */
export const HOMEPAGE_SETTING_KEYS: Record<keyof HomepageContent, string> = {
  heroBadge: 'home_hero_badge',
  heroNameFirst: 'home_hero_name_first',
  heroNameLast: 'home_hero_name_last',
  heroRole: 'home_hero_role',
  heroDescription: 'home_hero_description',
  heroBackgroundUrl: 'home_hero_background_url',
  heroProfileImage: 'home_hero_profile_image',
  heroCvUrl: 'home_hero_cv_url',
  heroPrimaryCtaLabel: 'home_hero_primary_cta_label',
  aboutHeading: 'home_about_heading',
  aboutImage: 'home_about_image',
  aboutParagraph1: 'home_about_paragraph_1',
  aboutParagraph2: 'home_about_paragraph_2',
}

export function mapSettingsToHomepageContent(
  settings: Record<string, string>,
): HomepageContent {
  const result = { ...DEFAULT_HOMEPAGE_CONTENT }
  for (const field of Object.keys(HOMEPAGE_SETTING_KEYS) as (keyof HomepageContent)[]) {
    const key = HOMEPAGE_SETTING_KEYS[field]
    const value = settings[key]
    if (typeof value === 'string' && value.trim() !== '') {
      result[field] = value
    }
  }
  return result
}

export function mapHomepageContentToSettings(
  content: HomepageContent,
): Record<string, string> {
  const out: Record<string, string> = {}
  for (const field of Object.keys(HOMEPAGE_SETTING_KEYS) as (keyof HomepageContent)[]) {
    out[HOMEPAGE_SETTING_KEYS[field]] = content[field]
  }
  return out
}
