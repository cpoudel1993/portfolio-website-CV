import { DEFAULT_HIGHLIGHTS, DEFAULT_SOCIAL_LINKS, SITE_CONTENT_KEYS } from "@/lib/site-content"
import { DEFAULT_HOMEPAGE_CONTENT, mapHomepageContentToSettings } from "@/lib/homepage-content"

async function seedDefaults() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE env vars")
    process.exit(1)
  }

  // Prepare default data
  const defaultSettings: Record<string, string> = {
    ...mapHomepageContentToSettings(DEFAULT_HOMEPAGE_CONTENT),
    [SITE_CONTENT_KEYS.highlights]: JSON.stringify(DEFAULT_HIGHLIGHTS),
    [SITE_CONTENT_KEYS.socialLinks]: JSON.stringify(DEFAULT_SOCIAL_LINKS),
  }

  console.log("Seeding default settings:", Object.keys(defaultSettings))

  try {
    const rows = Object.entries(defaultSettings).map(([key, value]) => ({ key, value }))

    const response = await fetch(`${supabaseUrl}/rest/v1/site_settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(rows),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Seed error:", response.status, error)
      process.exit(1)
    }

    console.log("✓ Database seeded with default settings")
    process.exit(0)
  } catch (e) {
    console.error("Seed failed:", e)
    process.exit(1)
  }
}

seedDefaults()
