import {
  Factory,
  HardHat,
  Coffee,
  Award,
  GraduationCap,
  Wrench,
  Briefcase,
  Code,
  Building2,
  Linkedin,
  Github,
  Youtube,
  Mail,
  Phone,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  type LucideIcon,
} from "lucide-react"

/** A highlight card shown in the About section. */
export interface Highlight {
  icon: string
  title: string
  description: string
}

/** A social / contact link shown in the footer and contact section. */
export interface SocialLink {
  icon: string
  label: string
  /** Display text (e.g. "linkedin.com/in/cpoudel1993" or "Hamilton, New Zealand"). */
  value: string
  /** Link target. Leave blank for non-link items such as Location. */
  href: string
}

/** Icons selectable for highlight cards in the admin panel. */
export const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  Factory,
  HardHat,
  Coffee,
  Award,
  GraduationCap,
  Wrench,
  Briefcase,
  Code,
  Building2,
}

/** Icons selectable for social / contact links in the admin panel. */
export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Linkedin,
  Github,
  Youtube,
  Mail,
  Phone,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
}

export const HIGHLIGHT_ICON_NAMES = Object.keys(HIGHLIGHT_ICONS)
export const SOCIAL_ICON_NAMES = Object.keys(SOCIAL_ICONS)

export function getHighlightIcon(name: string): LucideIcon {
  return HIGHLIGHT_ICONS[name] ?? Award
}

export function getSocialIcon(name: string): LucideIcon {
  return SOCIAL_ICONS[name] ?? Globe
}

export const DEFAULT_HIGHLIGHTS: Highlight[] = [
  {
    icon: "Factory",
    title: "Food Processing",
    description:
      "Full-time NZ employment experience handling edible internal products at Silver Fern Farms under strict food safety and hygiene standards.",
  },
  {
    icon: "HardHat",
    title: "Civil Engineering",
    description:
      "Diploma in Civil Engineering with hands-on experience in surveying, drafting, quality control, and site supervision on road and bridge projects.",
  },
  {
    icon: "Coffee",
    title: "Barista",
    description:
      "Advanced barista certification with expertise in beverage preparation, customer service, cash handling, and coffee shop management.",
  },
  {
    icon: "Award",
    title: "Continuous Learner",
    description:
      "Certified in AutoCAD, Revit, SketchUp, Full-Stack Web Development, Front-End Development, and Digital Marketing through LinkedIn Learning.",
  },
]

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    icon: "MapPin",
    label: "Location",
    value: "Hamilton, New Zealand",
    href: "",
  },
  {
    icon: "Linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/cpoudel1993",
    href: "https://www.linkedin.com/in/cpoudel1993/",
  },
  {
    icon: "Youtube",
    label: "YouTube",
    value: "Chiranjivi Poudel",
    href: "https://www.youtube.com/channel/UC7CJV2aO5MSQIPz8LHnobpg?sub_confirmation=1",
  },
  {
    icon: "Github",
    label: "GitHub",
    value: "cpoudel1993",
    href: "https://github.com/cpoudel1993",
  },
]

function isHighlight(value: unknown): value is Highlight {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Highlight).title === "string"
  )
}

function isSocialLink(value: unknown): value is SocialLink {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SocialLink).label === "string"
  )
}

export function parseHighlights(raw?: string | null): Highlight[] {
  console.log("[v0] parseHighlights raw input:", raw)
  if (!raw) return DEFAULT_HIGHLIGHTS
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isHighlight)) {
      const result = parsed.map((h) => ({
        icon: typeof h.icon === "string" ? h.icon : "Award",
        title: h.title,
        description: typeof h.description === "string" ? h.description : "",
      }))
      console.log("[v0] parseHighlights parsed:", result)
      return result
    }
    console.log("[v0] parseHighlights validation failed, using defaults")
    return DEFAULT_HIGHLIGHTS
  } catch (e) {
    console.log("[v0] parseHighlights error:", e)
    return DEFAULT_HIGHLIGHTS
  }
}

export function parseSocialLinks(raw?: string | null): SocialLink[] {
  console.log("[v0] parseSocialLinks raw input:", raw)
  if (!raw) return DEFAULT_SOCIAL_LINKS
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isSocialLink)) {
      const result = parsed.map((s) => ({
        icon: typeof s.icon === "string" ? s.icon : "Globe",
        label: s.label,
        value: typeof s.value === "string" ? s.value : "",
        href: typeof s.href === "string" ? s.href : "",
      }))
      console.log("[v0] parseSocialLinks parsed:", result)
      return result
    }
    console.log("[v0] parseSocialLinks validation failed, using defaults")
    return DEFAULT_SOCIAL_LINKS
  } catch (e) {
    console.log("[v0] parseSocialLinks error:", e)
    return DEFAULT_SOCIAL_LINKS
  }
}

/** Keys used in the `site_settings` table for these collections. */
export const SITE_CONTENT_KEYS = {
  highlights: "home_about_highlights",
  socialLinks: "site_social_links",
} as const
