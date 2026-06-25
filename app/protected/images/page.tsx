'use client'

import { useState, useEffect } from 'react'
import { Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { listImages, deleteImage } from '@/app/actions/images'

interface Image {
  name: string
  filename: string
  size: number
  created_at: string
  url: string
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    setLoading(true)
    const result = await listImages()
    if (result.success) {
      setImages(result.images)
      setError(null)
    } else {
      setError(result.error || 'Failed to load images')
    }
    setLoading(false)
  }

  const handleDelete = async (fullPath: string, filename: string) => {
    if (!confirm(`Delete "${filename}"? This action cannot be undone.`)) return

    setDeleting(fullPath)
    const result = await deleteImage(fullPath)
    if (result.success) {
      setImages(images.filter((img) => img.name !== fullPath))
      setError(null)
    } else {
      setError(result.error || 'Failed to delete image')
    }
    setDeleting(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Gallery</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all uploaded images. Delete images you no longer need.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="text-sm text-destructive">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No images uploaded yet.</p>
        </div>
      )}

      {/* Images Grid */}
      {!loading && images.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.name} className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
              {/* Image Preview */}
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.log('[v0] Image failed to load:', image.url)
                  }}
                />
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-medium text-sm text-foreground truncate" title={image.name}>
                    {image.filename}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(image.size)} • {formatDate(image.created_at)}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 truncate" title={image.name}>
                    Path: {image.name}
                  </p>
                </div>

                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleDelete(image.name, image.filename)}
                  disabled={deleting === image.name}
                >
                  {deleting === image.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleting === image.name ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {!loading && images.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Total images: <span className="font-semibold text-foreground">{images.length}</span> •
            Total size: <span className="font-semibold text-foreground">{formatFileSize(images.reduce((sum, img) => sum + img.size, 0))}</span>
          </p>
        </div>
      )}
    </div>
  )
}
