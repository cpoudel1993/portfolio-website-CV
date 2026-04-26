"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Camera,
  MapPin,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type Category =
  | "all"
  | "landscape"
  | "culture"
  | "nature"
  | "travel"
  | "portrait"
  | "architecture"
  | "other"

interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  location: string
  date: string
  category: Category
}

interface GalleryRow {
  id: string
  title: string
  location: string | null
  year: string | null
  category: string
  image_url: string
  alt: string | null
  status: string
  sort_order: number | null
  created_at: string
}

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "landscape", label: "Landscape" },
  { value: "culture", label: "Culture" },
  { value: "nature", label: "Nature" },
  { value: "travel", label: "Travel" },
]

function rowToImage(row: GalleryRow): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt ?? row.title,
    title: row.title,
    location: row.location ?? "",
    date: row.year ?? "",
    category: (row.category as Category) ?? "other",
  }
}

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  // Initial fetch + realtime subscription so admin changes appear live
  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select(
          "id, title, location, year, category, image_url, alt, status, sort_order, created_at"
        )
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })

      if (!mounted) return
      if (error) {
        console.error("[v0] gallery fetch error:", error.message)
        setLoading(false)
        return
      }
      setImages((data ?? []).map(rowToImage))
      setLoading(false)
    }

    fetchPhotos()

    const channel = supabase
      .channel("gallery_photos_public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery_photos" },
        () => {
          fetchPhotos()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory)

  const openFocus = useCallback((index: number) => setFocusedIndex(index), [])
  const closeFocus = useCallback(() => setFocusedIndex(null), [])

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

  // Reset focus when filter changes so we don't index into stale list
  useEffect(() => {
    setFocusedIndex(null)
  }, [selectedCategory])

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
    return () => {
      document.body.style.overflow = ""
    }
  }, [focusedIndex])

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

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
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

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openFocus(index)}
                aria-label={`Open ${image.title}`}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border bg-muted text-left transition-all duration-500 hover:border-primary/40 hover:shadow-xl"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Info on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="mb-1 font-semibold text-white">{image.title}</h3>
                  {image.location && (
                    <div className="flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{image.location}</span>
                    </div>
                  )}
                </div>

                {/* Zoom indicator */}
                <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-4 w-4 text-white" />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Camera className="mb-4 h-14 w-14 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">
              No photos in this category yet.
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Check back soon for new captures.
            </p>
          </div>
        )}
      </div>

      {/* Full-screen Focus View */}
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
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
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

          {/* Image — original resolution preserved */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={focusedImage.src || "/placeholder.svg"}
              alt={focusedImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
              priority
            />
          </div>

          {/* Bottom Bar */}
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
