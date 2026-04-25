"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Camera,
  MapPin,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Category = "all" | "landscape" | "culture" | "nature" | "travel"

interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  location: string
  date: string
  category: Category
}

const INITIAL_IMAGES: GalleryImage[] = [
  {
    id: "1",
    src: "/images/gallery/annapurna-dawn.jpg",
    alt: "Twin snow-capped Annapurna peaks against a soft grey sky",
    title: "Annapurna at Dawn",
    location: "Poon Hill, Nepal",
    date: "2024",
    category: "landscape",
  },
  {
    id: "2",
    src: "/images/gallery/annapurna-blue-sky.jpg",
    alt: "Annapurna range panorama under a vivid blue sky",
    title: "Annapurna Panorama",
    location: "Pokhara, Nepal",
    date: "2024",
    category: "landscape",
  },
  {
    id: "3",
    src: "/images/gallery/shiva-pumdikot.jpg",
    alt: "Lord Shiva statue atop the Pumdikot dome temple against blue sky",
    title: "Shiva at Pumdikot",
    location: "Pumdikot, Pokhara, Nepal",
    date: "2024",
    category: "culture",
  },
  {
    id: "4",
    src: "/images/gallery/mountain-peaks.jpg",
    alt: "Snow-capped Himalayan mountain peaks at twilight",
    title: "Himalayan Peaks",
    location: "Annapurna Region, Nepal",
    date: "2024",
    category: "landscape",
  },
  {
    id: "5",
    src: "/images/gallery/pokhara-valley.jpg",
    alt: "Panoramic view of Pokhara Valley with Phewa Lake",
    title: "Pokhara Valley",
    location: "Sarangkot, Pokhara, Nepal",
    date: "2024",
    category: "landscape",
  },
  {
    id: "6",
    src: "/images/gallery/shiva-statue.jpg",
    alt: "Majestic Lord Shiva statue at Pumdikot, Pokhara",
    title: "Lord Shiva Statue",
    location: "Pumdikot, Pokhara, Nepal",
    date: "2024",
    category: "culture",
  },
]

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "landscape", label: "Landscape" },
  { value: "culture", label: "Culture" },
  { value: "nature", label: "Nature" },
  { value: "travel", label: "Travel" },
]

interface AddPhotoForm {
  src: string
  title: string
  location: string
  date: string
  category: Category
  alt: string
}

const emptyForm: AddPhotoForm = {
  src: "",
  title: "",
  location: "",
  date: new Date().getFullYear().toString(),
  category: "landscape",
  alt: "",
}

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES)
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState<AddPhotoForm>(emptyForm)
  const [previewSrc, setPreviewSrc] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory)

  const openFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const closeFocus = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  const goToPrevious = useCallback(() => {
    setFocusedIndex((prev) =>
      prev === null ? null : prev === 0 ? filteredImages.length - 1 : prev - 1
    )
  }, [filteredImages.length])

  const goToNext = useCallback(() => {
    setFocusedIndex((prev) =>
      prev === null ? null : prev === filteredImages.length - 1 ? 0 : prev + 1
    )
  }, [filteredImages.length])

  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => prev.filter((img) => img.id !== id))
      // If the removed image was focused, close focus
      if (focusedIndex !== null) {
        const removedIndex = filteredImages.findIndex((img) => img.id === id)
        if (removedIndex === focusedIndex) closeFocus()
      }
    },
    [focusedIndex, filteredImages, closeFocus]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedIndex === null) return
      if (e.key === "Escape") closeFocus()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, closeFocus, goToPrevious, goToNext])

  // Lock body scroll when focused
  useEffect(() => {
    document.body.style.overflow = focusedIndex !== null ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [focusedIndex])

  // Handle file upload preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setPreviewSrc(objectUrl)
    setForm((f) => ({ ...f, src: objectUrl, alt: file.name }))
  }

  const handleAddPhoto = () => {
    if (!form.src || !form.title) return
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      src: form.src,
      alt: form.alt || form.title,
      title: form.title,
      location: form.location,
      date: form.date,
      category: form.category,
    }
    setImages((prev) => [newImage, ...prev])
    setForm(emptyForm)
    setPreviewSrc("")
    setShowAddForm(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const focusedImage = focusedIndex !== null ? filteredImages[focusedIndex] : null

  return (
    <section id="gallery" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">

        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Photography
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            My Collection
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            Moments captured across Nepal — landscapes, culture, and nature through my lens.
          </p>
          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-primary" />
        </div>

        {/* Controls Row */}
        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="transition-all duration-200"
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Add Photo Button */}
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setShowAddForm((v) => !v)}
          >
            <Plus className="h-4 w-4" />
            Add Photo
          </Button>
        </div>

        {/* Add Photo Form */}
        {showAddForm && (
          <div className="mb-10 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 text-lg font-semibold text-foreground">Add New Photo</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* File Upload */}
              <div className="sm:col-span-2">
                <Label htmlFor="photo-file" className="mb-1.5 block text-sm text-muted-foreground">
                  Photo File
                </Label>
                <input
                  ref={fileInputRef}
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
                />
                {previewSrc && (
                  <div className="mt-3 h-40 w-full overflow-hidden rounded-lg border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="photo-title" className="mb-1.5 block text-sm text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="photo-title"
                  placeholder="e.g. Sunrise over Pokhara"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="photo-location" className="mb-1.5 block text-sm text-muted-foreground">
                  Location
                </Label>
                <Input
                  id="photo-location"
                  placeholder="e.g. Pokhara, Nepal"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="photo-date" className="mb-1.5 block text-sm text-muted-foreground">
                  Year
                </Label>
                <Input
                  id="photo-date"
                  placeholder="2024"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="photo-category" className="mb-1.5 block text-sm text-muted-foreground">
                  Category
                </Label>
                <select
                  id="photo-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.filter((c) => c.value !== "all").map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                onClick={handleAddPhoto}
                disabled={!form.src || !form.title}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add to Collection
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setForm(emptyForm)
                  setPreviewSrc("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border bg-muted transition-all duration-500 hover:border-primary/40 hover:shadow-xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onClick={() => openFocus(index)}
                />

                {/* Hover Overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  onClick={() => openFocus(index)}
                />

                {/* Info on hover */}
                <div
                  className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0"
                  onClick={() => openFocus(index)}
                >
                  <h3 className="mb-1 font-semibold text-white">{image.title}</h3>
                  {image.location && (
                    <div className="flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{image.location}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons top-right */}
                <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    aria-label="View full size"
                    onClick={() => openFocus(index)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70"
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </button>
                  <button
                    aria-label="Remove photo"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-destructive/80"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Camera className="mb-4 h-14 w-14 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">No photos in this category.</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Switch categories or add new photos using the button above.
            </p>
          </div>
        )}
      </div>

      {/* Full-screen Focus View — all other images hidden */}
      {focusedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={focusedImage.title}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{focusedImage.title}</h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                {focusedImage.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {focusedImage.location}
                  </span>
                )}
                {focusedImage.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {focusedImage.date}
                  </span>
                )}
              </div>
            </div>
            <button
              aria-label="Close"
              onClick={closeFocus}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Image — fills remaining space at full resolution */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={focusedImage.src}
              alt={focusedImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
              priority
            />
          </div>

          {/* Bottom Bar — counter + navigation */}
          <div className="flex items-center justify-center gap-6 px-4 py-4">
            <button
              aria-label="Previous photo"
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <span className="text-sm tabular-nums text-white/50">
              {(focusedIndex ?? 0) + 1} / {filteredImages.length}
            </span>

            <button
              aria-label="Next photo"
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
