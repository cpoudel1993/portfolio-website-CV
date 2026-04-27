'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, Edit, Save, ExternalLink, Check, AlertCircle } from 'lucide-react'
import { upsertSEOSettings } from '@/app/actions/seo'

interface SEOSettings {
  id?: string
  page_slug: string
  meta_title: string | null
  meta_description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
}

interface PageWithSEO {
  slug: string
  name: string
  path: string
  seo: SEOSettings | null
}

interface SEOManagerProps {
  pages: PageWithSEO[]
  userId: string
}

export function SEOManager({ pages, userId }: SEOManagerProps) {
  const [selectedPage, setSelectedPage] = useState<PageWithSEO | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const [formData, setFormData] = useState<SEOSettings>({
    page_slug: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots_index: true,
    robots_follow: true,
  })

  const openEditDialog = (page: PageWithSEO) => {
    setSelectedPage(page)
    setFormData({
      id: page.seo?.id,
      page_slug: page.slug,
      meta_title: page.seo?.meta_title || '',
      meta_description: page.seo?.meta_description || '',
      keywords: page.seo?.keywords || '',
      og_title: page.seo?.og_title || '',
      og_description: page.seo?.og_description || '',
      og_image: page.seo?.og_image || '',
      canonical_url: page.seo?.canonical_url || '',
      robots_index: page.seo?.robots_index ?? true,
      robots_follow: page.seo?.robots_follow ?? true,
    })
    setSaveStatus({ type: null, message: '' })
    setIsOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus({ type: null, message: '' })

    try {
      const result = await upsertSEOSettings({
        ...formData,
        user_id: userId,
      })

      if (result.success) {
        setSaveStatus({ type: 'success', message: 'SEO settings saved successfully!' })
        setTimeout(() => {
          setIsOpen(false)
          window.location.reload()
        }, 1500)
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Failed to save settings' })
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page) => (
        <Card key={page.slug} className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{page.name}</CardTitle>
                <CardDescription className="text-xs">{page.path}</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {page.seo ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                    <Check className="mr-1 h-3 w-3" />
                    Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Not Set
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {page.seo && (
              <div className="mb-4 space-y-1">
                <p className="text-xs text-muted-foreground truncate">
                  <strong>Title:</strong> {page.seo.meta_title || 'Not set'}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  <strong>Description:</strong> {page.seo.meta_description || 'Not set'}
                </p>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => openEditDialog(page)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {page.seo ? 'Edit SEO' : 'Configure SEO'}
            </Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              SEO Settings - {selectedPage?.name}
            </DialogTitle>
            <DialogDescription>
              Configure search engine optimization settings for this page
            </DialogDescription>
          </DialogHeader>

          {saveStatus.type && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 ${
                saveStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {saveStatus.type === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{saveStatus.message}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Meta Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Meta Information</h3>
              
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title || ''}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Page title for search engines"
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Brief description of the page content"
                  rows={3}
                  className="mt-1.5"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords || ''}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="canonical_url">Canonical URL</Label>
                <Input
                  id="canonical_url"
                  value={formData.canonical_url || ''}
                  onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                  placeholder="https://example.com/page"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Open Graph */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Open Graph (Social Sharing)</h3>

              <div>
                <Label htmlFor="og_title">OG Title</Label>
                <Input
                  id="og_title"
                  value={formData.og_title || ''}
                  onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                  placeholder="Title for social media shares"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="og_description">OG Description</Label>
                <Textarea
                  id="og_description"
                  value={formData.og_description || ''}
                  onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                  placeholder="Description for social media shares"
                  rows={2}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="og_image">OG Image URL</Label>
                <Input
                  id="og_image"
                  value={formData.og_image || ''}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Robots */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Search Engine Indexing</h3>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Allow Indexing</p>
                  <p className="text-xs text-muted-foreground">
                    Let search engines index this page
                  </p>
                </div>
                <Switch
                  checked={formData.robots_index}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, robots_index: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-medium">Allow Following Links</p>
                  <p className="text-xs text-muted-foreground">
                    Let search engines follow links on this page
                  </p>
                </div>
                <Switch
                  checked={formData.robots_follow}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, robots_follow: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
