"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  "landscape",
  "culture",
  "nature",
  "travel",
  "portrait",
  "architecture",
  "other",
] as const

type Category = (typeof CATEGORIES)[number]
type Status = "draft" | "published" | "archived"

export interface GalleryPhoto {
  id: string
  title: string
  location: string | null
  year: string | null
  category: string
  image_url: string
  alt: string | null
  status: string
  sort_order: number | null
  storage_path: string | null
  created_at: string
  updated_at?: string
}

interface FormState {
  title: string
  location: string
  year: string
  category: Category
  alt: string
  status: Status
  sort_order: string
  image_url: string
  storage_path: string | null
}

const emptyForm: FormState = {
  title: "",
  location: "",
  year: new Date().getFullYear().toString(),
  category: "landscape",
  alt: "",
  status: "draft",
  sort_order: "0",
  image_url: "",
  storage_path: null,
}

interface GalleryManagerProps {
  initialPhotos: GalleryPhoto[]
  userId: string
}

export function GalleryManager({ initialPhotos, userId }: GalleryManagerProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | Status>("all")
  const [filterCategory, setFilterCategory] = useState<"all" | Category>("all")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = useMemo(() => createClient(), [])

  // Subscribe to realtime updates so the table stays fresh when external changes happen
  useEffect(() => {
    const channel = supabase
      .channel("gallery_photos_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_photos" },
        async () => {
          const { data } = await supabase
            .from("gallery_photos")
            .select(
              "id, title, location, year, category, image_url, alt, status, sort_order, storage_path, created_at, updated_at"
            )
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false })
          if (data) setPhotos(data as GalleryPhoto[])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredPhotos = photos.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false
    if (filterCategory !== "all" && p.category !== filterCategory) return false
    return true
  })

  const counts = {
    total: photos.length,
    published: photos.filter((p) => p.status === "published").length,
    draft: photos.filter((p) => p.status === "draft").length,
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFilePreview(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setDialogOpen(true)
  }

  function openEdit(photo: GalleryPhoto) {
    setEditingId(photo.id)
    setForm({
      title: photo.title,
      location: photo.location ?? "",
      year: photo.year ?? "",
      category: (CATEGORIES.includes(photo.category as Category)
        ? (photo.category as Category)
        : "other"),
      alt: photo.alt ?? "",
      status: (photo.status as Status) ?? "draft",
      sort_order: String(photo.sort_order ?? 0),
      image_url: photo.image_url,
      storage_path: photo.storage_path,
    })
    setFilePreview(photo.image_url)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setDialogOpen(true)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.")
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Image is larger than 25 MB. Please choose a smaller file.")
      return
    }

    setError(null)
    setFilePreview(URL.createObjectURL(file))
    setIsUploading(true)
    setUploadProgress("Uploading to Supabase Storage...")

    try {
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `${userId}/${Date.now()}-${Math.random()
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

      // If we're replacing an image during edit, remove the old storage object
      if (editingId && form.storage_path) {
        await supabase.storage
          .from("gallery-images")
          .remove([form.storage_path])
          .catch(() => {})
      }

      setForm((f) => ({ ...f, image_url: publicUrl, storage_path: path }))
      setUploadProgress("Upload complete.")
    } catch (err) {
      console.error("[v0] upload error", err)
      setError(err instanceof Error ? err.message : "Upload failed")
      setUploadProgress(null)
      setFilePreview(form.image_url || null)
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(null), 2000)
    }
  }

  async function handleSave() {
    setError(null)

    if (!form.title.trim()) {
      setError("Title is required.")
      return
    }
    if (!form.image_url) {
      setError("Please upload an image.")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        location: form.location.trim() || null,
        year: form.year.trim() || null,
        category: form.category,
        alt: form.alt.trim() || null,
        status: form.status,
        sort_order: Number.parseInt(form.sort_order || "0", 10) || 0,
        image_url: form.image_url,
        storage_path: form.storage_path,
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("gallery_photos")
          .update(payload)
          .eq("id", editingId)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("gallery_photos")
          .insert({ ...payload, user_id: userId })
        if (insertError) throw insertError
      }

      setDialogOpen(false)
      setForm(emptyForm)
      setFilePreview(null)
      setEditingId(null)
    } catch (err) {
      console.error("[v0] save error", err)
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setIsDeleting(true)
    try {
      const photo = photos.find((p) => p.id === id)
      if (photo?.storage_path) {
        await supabase.storage
          .from("gallery-images")
          .remove([photo.storage_path])
          .catch(() => {})
      }
      const { error: deleteError } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", id)
      if (deleteError) throw deleteError
      setConfirmDeleteId(null)
    } catch (err) {
      console.error("[v0] delete error", err)
      setError(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setIsDeleting(false)
    }
  }

  async function toggleStatus(photo: GalleryPhoto) {
    const next: Status = photo.status === "published" ? "draft" : "published"
    const { error: updateError } = await supabase
      .from("gallery_photos")
      .update({ status: next })
      .eq("id", photo.id)
    if (updateError) {
      console.error("[v0] toggle status error", updateError)
      setError(updateError.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold text-foreground">{counts.total}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-muted-foreground">Published</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {counts.published}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-muted-foreground">Draft</p>
            <p className="font-semibold text-amber-600 dark:text-amber-400">
              {counts.draft}
            </p>
          </div>
        </div>

        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Photo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Status</Label>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as "all" | Status)}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Category</Label>
          <Select
            value={filterCategory}
            onValueChange={(v) => setFilterCategory(v as "all" | Category)}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inline error (from delete/toggle) */}
      {error && !dialogOpen && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <ImageIcon className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="font-medium text-foreground">No photos match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting filters or upload a new photo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={photo.image_url || "/placeholder.svg"}
                  alt={photo.alt ?? photo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  unoptimized
                />
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm",
                    photo.status === "published"
                      ? "bg-emerald-500/90 text-white"
                      : photo.status === "draft"
                        ? "bg-amber-500/90 text-white"
                        : "bg-zinc-500/90 text-white"
                  )}
                >
                  {photo.status}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-1 p-3">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {photo.title}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  {photo.location || "—"}
                  {photo.year ? ` · ${photo.year}` : ""}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {photo.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{photo.sort_order ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 border-t border-border p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => toggleStatus(photo)}
                  title={
                    photo.status === "published"
                      ? "Unpublish (set to draft)"
                      : "Publish"
                  }
                >
                  {photo.status === "published" ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(photo)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmDeleteId(photo.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Photo" : "Add Photo"}</DialogTitle>
            <DialogDescription>
              Upload an image and fill out its details. Published photos appear on the public site.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <Label className="mb-1.5 block text-sm">Image</Label>
              <div className="flex flex-col gap-3">
                {filePreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={filePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                    <p className="text-sm">No image selected</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4" />
                    {filePreview ? "Replace image" : "Choose image"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {uploadProgress && (
                    <span className="text-xs text-muted-foreground">{uploadProgress}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Sunrise at Sarangkot"
              />
            </div>

            {/* Location + Year */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Pokhara, Nepal"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  placeholder="2024"
                />
              </div>
            </div>

            {/* Category + Status + Sort */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v as Category }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as Status }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="sort">Sort Order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Alt text */}
            <div className="grid gap-1.5">
              <Label htmlFor="alt">Alt text</Label>
              <Textarea
                id="alt"
                value={form.alt}
                onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                placeholder="Describe the image for accessibility & SEO"
                rows={2}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isUploading || !form.image_url}
              className="gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Save changes" : "Add photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the photo from your collection and from Supabase Storage. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
