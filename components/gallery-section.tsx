"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

type Category = "all" | "landscape" | "culture" | "nature" | "travel"

interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  location: string
  date: string
  category: Category
  width: number
  height: number
}

const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/images/gallery/shiva-statue.jpg",
    alt: "Majestic Lord Shiva statue at Pumdikot, Pokhara",
    title: "Lord Shiva Statue",
    location: "Pumdikot, Pokhara, Nepal",
    date: "2024",
    category: "culture",
    width: 1600,
    height: 1067,
  },
  {
    id: "2",
    src: "/images/gallery/mountain-peaks.jpg",
    alt: "Snow-capped Annapurna mountain peaks at sunrise",
    title: "Annapurna Peaks",
    location: "Poon Hill, Nepal",
    date: "2024",
    category: "landscape",
  width: 1600,
    height: 1067,
  },
  {
    id: "3",
    src: "/images/gallery/pokhara-valley.jpg",
    alt: "Panoramic view of Pokhara Valley with Phewa Lake",
    title: "Pokhara Valley",
    location: "Sarangkot, Pokhara, Nepal",
    date: "2024",
    category: "landscape",
    width: 1600,
    height: 900,
  },
  {
    id: "4",
    src: "/images/anime-mountain-bg-1.jpg",
    alt: "Himalayan peaks in anime art style",
    title: "Mountain Dreams",
    location: "Nepal",
    date: "2024",
    category: "nature",
    width: 1600,
    height: 1067,
  },
  {
    id: "5",
    src: "/images/anime-mountain-bg-2.jpg",
    alt: "Mountain sunset panorama in anime style",
    title: "Golden Hour",
    location: "Nepal",
    date: "2024",
    category: "nature",
    width: 1600,
    height: 900,
  },
  {
    id: "6",
    src: "/images/mountain-original-1.jpg",
    alt: "Original mountain photograph",
    title: "Mountain Majesty",
    location: "Annapurna Region, Nepal",
    date: "2024",
    category: "landscape",
    width: 1600,
    height: 1067,
  },
]

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "landscape", label: "Landscape" },
  { value: "culture", label: "Culture" },
  { value: "nature", label: "Nature" },
  { value: "travel", label: "Travel" },
]

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory)

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
  }, [filteredImages.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
  }, [filteredImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, closeLightbox, goToPrevious, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  return (
    <section id="gallery" className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Gallery
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Photography Collection
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Capturing moments from Nepal and beyond. Landscapes, culture, and nature through my lens.
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
              className="transition-all duration-300"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border bg-muted transition-all duration-500 hover:border-primary/30 hover:shadow-xl"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Info */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="mb-1 text-lg font-semibold text-white">{image.title}</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{image.location}</span>
                </div>
              </div>

              {/* Zoom Icon */}
              <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Camera className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && filteredImages[currentIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image Container */}
          <div
            className="relative mx-auto flex max-h-[85vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full max-w-5xl">
              <Image
                src={filteredImages[currentIndex].src}
                alt={filteredImages[currentIndex].alt}
                fill
                className="object-contain transition-opacity duration-300"
                sizes="90vw"
                priority
              />
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">
                {filteredImages[currentIndex].title}
              </h3>
              <div className="mt-2 flex items-center justify-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {filteredImages[currentIndex].location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {filteredImages[currentIndex].date}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/50">
                {currentIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
