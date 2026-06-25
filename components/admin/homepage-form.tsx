"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle, X, Save, Upload, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { upsertSiteSettings } from "@/app/actions/site-settings"
import {
  DEFAULT_HOMEPAGE_CONTENT,
  mapSettingsToHomepageContent,
  mapHomepageContentToSettings,
  type HomepageContent,
} from "@/lib/homepage-content"
import {
  parseHighlights,
  parseSocialLinks,
  getHighlightIcon,
  getSocialIcon,
  HIGHLIGHT_ICON_NAMES,
  SOCIAL_ICON_NAMES,
  SITE_CONTENT_KEYS,
  type Highlight,
  type SocialLink,
} from "@/lib/site-content"

type Status = { type: "success" | "error"; message: string } | null

interface HomepageFormProps {
  initial: Record<string, string>
  userId: string
}

export function HomepageForm({ initial, userId }: HomepageFormProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>(null)
  const [content, setContent] = useState<HomepageContent>(() =>
    mapSettingsToHomepageContent(initial),
  )
  const [highlights, setHighlights] = useState<Highlight[]>(() =>
    parseHighlights(initial[SITE_CONTENT_KEYS.highlights]),
  )
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() =>
    parseSocialLinks(initial[SITE_CONTENT_KEYS.socialLinks]),
  )
  const [uploadingField, setUploadingField] = useState<keyof HomepageContent | string | null>(null)
  const [contactBgImage, setContactBgImage] = useState<string>(
    initial.contact_bg_image || '/images/anime-mountain-bg-2.jpg',
  )

  const bgInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const aboutInputRef = useRef<HTMLInputElement>(null)
  const contactBgInputRef = useRef<HTMLInputElement>(null)

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const set = (field: keyof HomepageContent, value: string) =>
    setContent((c) => ({ ...c, [field]: value }))

  // Highlight card helpers
  const addHighlight = () =>
    setHighlights((h) => [...h, { icon: "Award", title: "", description: "" }])
  const updateHighlight = (index: number, field: keyof Highlight, value: string) =>
    setHighlights((h) => h.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeHighlight = (index: number) =>
    setHighlights((h) => h.filter((_, i) => i !== index))

  // Social link helpers
  const addSocialLink = () =>
    setSocialLinks((s) => [...s, { icon: "Globe", label: "", value: "", href: "" }])
  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) =>
    setSocialLinks((s) => s.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  const removeSocialLink = (index: number) =>
    setSocialLinks((s) => s.filter((_, i) => i !== index))

  async function uploadImage(
    field: keyof HomepageContent | string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      flash({ type: "error", message: "Please select an image file." })
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      flash({ type: "error", message: "Image is larger than 25 MB." })
      return
    }

    setUploadingField(field)
    try {
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `${userId}/homepage/${field}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery-images").getPublicUrl(path)

      if (field === 'contact_bg_image') {
        setContactBgImage(publicUrl)
      } else {
        set(field as keyof HomepageContent, publicUrl)
      }
      flash({ type: "success", message: "Image uploaded. Remember to save." })
    } catch (err) {
      console.error("[v0] homepage image upload error", err)
      flash({ type: "error", message: err instanceof Error ? err.message : "Upload failed" })
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const payload = {
        ...mapHomepageContentToSettings(content),
        [SITE_CONTENT_KEYS.highlights]: JSON.stringify(highlights),
        [SITE_CONTENT_KEYS.socialLinks]: JSON.stringify(socialLinks),
        contact_bg_image: contactBgImage,
      }
      console.log("[v0] Saving homepage settings:", payload)
      const result = await upsertSiteSettings(payload)
      if (result.success) {
        flash({ type: "success", message: "Homepage updated." })
        router.refresh()
      } else {
        flash({ type: "error", message: result.error || "Failed to save." })
      }
    })
  }

  const resetDefaults = () => {
    setContent(DEFAULT_HOMEPAGE_CONTENT)
    setHighlights(parseHighlights(undefined))
    setSocialLinks(parseSocialLinks(undefined))
    flash({ type: "success", message: "Reset to defaults. Remember to save." })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100"
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {status.message}
          </div>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="opacity-60 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Hero Section</h2>

        {/* Background image */}
        <div className="mb-6">
          <Label>Background image</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border bg-muted sm:w-56">
              {content.heroBackgroundUrl ? (
                <Image
                  src={content.heroBackgroundUrl || "/placeholder.svg"}
                  alt="Hero background preview"
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              ) : null}
            </div>
            <div className="flex-1 space-y-2">
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage("heroBackgroundUrl", e)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={uploadingField === "heroBackgroundUrl"}
                onClick={() => bgInputRef.current?.click()}
              >
                {uploadingField === "heroBackgroundUrl" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload background
              </Button>
              <Input
                value={content.heroBackgroundUrl}
                onChange={(e) => set("heroBackgroundUrl", e.target.value)}
                placeholder="Or paste an image URL"
              />
            </div>
          </div>
        </div>

        {/* Profile image */}
        <div className="mb-6">
          <Label>Profile image</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-border bg-muted">
              {content.heroProfileImage ? (
                <Image
                  src={content.heroProfileImage || "/placeholder.svg"}
                  alt="Profile preview"
                  fill
                  className="object-cover object-top"
                  sizes="128px"
                />
              ) : null}
            </div>
            <div className="flex-1 space-y-2">
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage("heroProfileImage", e)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={uploadingField === "heroProfileImage"}
                onClick={() => profileInputRef.current?.click()}
              >
                {uploadingField === "heroProfileImage" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload photo
              </Button>
              <Input
                value={content.heroProfileImage}
                onChange={(e) => set("heroProfileImage", e.target.value)}
                placeholder="Or paste an image URL"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="heroBadge">Location badge</Label>
            <Input
              id="heroBadge"
              value={content.heroBadge}
              onChange={(e) => set("heroBadge", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroRole">Role / tagline</Label>
            <Input
              id="heroRole"
              value={content.heroRole}
              onChange={(e) => set("heroRole", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroNameFirst">First name</Label>
            <Input
              id="heroNameFirst"
              value={content.heroNameFirst}
              onChange={(e) => set("heroNameFirst", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroNameLast">Last name (highlighted)</Label>
            <Input
              id="heroNameLast"
              value={content.heroNameLast}
              onChange={(e) => set("heroNameLast", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroPrimaryCtaLabel">Primary button label</Label>
            <Input
              id="heroPrimaryCtaLabel"
              value={content.heroPrimaryCtaLabel}
              onChange={(e) => set("heroPrimaryCtaLabel", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="heroCvUrl">Download CV link</Label>
            <Input
              id="heroCvUrl"
              value={content.heroCvUrl}
              onChange={(e) => set("heroCvUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="heroDescription">Hero description</Label>
          <Textarea
            id="heroDescription"
            rows={3}
            value={content.heroDescription}
            onChange={(e) => set("heroDescription", e.target.value)}
          />
        </div>
      </div>

      {/* About */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">About Section</h2>

        <div className="mb-6">
          <Label>About image</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-border bg-muted">
              {content.aboutImage ? (
                <Image
                  src={content.aboutImage || "/placeholder.svg"}
                  alt="About preview"
                  fill
                  className="object-cover object-top"
                  sizes="128px"
                />
              ) : null}
            </div>
            <div className="flex-1 space-y-2">
              <input
                ref={aboutInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage("aboutImage", e)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={uploadingField === "aboutImage"}
                onClick={() => aboutInputRef.current?.click()}
              >
                {uploadingField === "aboutImage" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload photo
              </Button>
              <Input
                value={content.aboutImage}
                onChange={(e) => set("aboutImage", e.target.value)}
                placeholder="Or paste an image URL"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="aboutHeading">About heading</Label>
          <Input
            id="aboutHeading"
            value={content.aboutHeading}
            onChange={(e) => set("aboutHeading", e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="aboutParagraph1">Paragraph 1</Label>
          <Textarea
            id="aboutParagraph1"
            rows={4}
            value={content.aboutParagraph1}
            onChange={(e) => set("aboutParagraph1", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="aboutParagraph2">Paragraph 2</Label>
          <Textarea
            id="aboutParagraph2"
            rows={4}
            value={content.aboutParagraph2}
            onChange={(e) => set("aboutParagraph2", e.target.value)}
          />
        </div>
      </div>

      {/* Highlight cards */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">About Highlights</h2>
            <p className="text-sm text-muted-foreground">
              The cards shown under the About section (Food Processing, Civil Engineering, etc.).
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addHighlight}>
            <Plus className="h-4 w-4" />
            Add card
          </Button>
        </div>

        <div className="space-y-4">
          {highlights.length === 0 && (
            <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              No highlight cards. Click &quot;Add card&quot; to create one.
            </p>
          )}
          {highlights.map((item, index) => {
            const Icon = getHighlightIcon(item.icon)
            return (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Card {index + 1}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeHighlight(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateHighlight(index, "icon", e.target.value)}
                      className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {HIGHLIGHT_ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateHighlight(index, "title", e.target.value)}
                      placeholder="e.g. Food Processing"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => updateHighlight(index, "description", e.target.value)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Social / contact links */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Social &amp; Contact Links</h2>
            <p className="text-sm text-muted-foreground">
              Shown in the footer and the Contact section (Location, LinkedIn, YouTube, GitHub).
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addSocialLink}>
            <Plus className="h-4 w-4" />
            Add link
          </Button>
        </div>

        <div className="space-y-4">
          {socialLinks.length === 0 && (
            <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              No links. Click &quot;Add link&quot; to create one.
            </p>
          )}
          {socialLinks.map((item, index) => {
            const Icon = getSocialIcon(item.icon)
            return (
              <div key={index} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.label || `Link ${index + 1}`}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Icon / logo</Label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateSocialLink(index, "icon", e.target.value)}
                      className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {SOCIAL_ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => updateSocialLink(index, "label", e.target.value)}
                      placeholder="e.g. LinkedIn"
                    />
                  </div>
                  <div>
                    <Label>Display text</Label>
                    <Input
                      value={item.value}
                      onChange={(e) => updateSocialLink(index, "value", e.target.value)}
                      placeholder="e.g. linkedin.com/in/cpoudel1993"
                    />
                  </div>
                  <div>
                    <Label>Link URL (optional)</Label>
                    <Input
                      value={item.href}
                      onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                      placeholder="https://... (leave blank for Location)"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Section Background Image */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Contact Section Background</h2>
        <div className="flex items-end gap-4">
          {contactBgImage && (
            <div className="relative h-32 w-48 flex-shrink-0 rounded-lg border border-border overflow-hidden">
              <Image
                src={contactBgImage}
                alt="Contact background preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <Label htmlFor="contact-bg">Choose Image</Label>
            <input
              ref={contactBgInputRef}
              id="contact-bg"
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage('contact_bg_image', e)}
              disabled={uploadingField === 'contact_bg_image'}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingField === 'contact_bg_image'}
              className="gap-2 mt-2"
              onClick={() => contactBgInputRef.current?.click()}
            >
              {uploadingField === 'contact_bg_image' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={resetDefaults}>
          Reset to defaults
        </Button>
        <Button type="submit" disabled={isPending || uploadingField !== null} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save Homepage"}
        </Button>
      </div>
    </form>
  )
}
