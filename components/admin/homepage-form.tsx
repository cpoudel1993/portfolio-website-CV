"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle, X, Save, Upload, Loader2 } from "lucide-react"
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
  const [uploadingField, setUploadingField] = useState<keyof HomepageContent | null>(null)

  const bgInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)
  const aboutInputRef = useRef<HTMLInputElement>(null)

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const set = (field: keyof HomepageContent, value: string) =>
    setContent((c) => ({ ...c, [field]: value }))

  async function uploadImage(
    field: keyof HomepageContent,
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

      set(field, publicUrl)
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
      const result = await upsertSiteSettings(mapHomepageContentToSettings(content))
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
