'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { upsertProfile, type ProfileInput } from '@/app/actions/profile'

type Status = { type: 'success' | 'error'; message: string } | null

interface ProfileFormProps {
  initial: Partial<ProfileInput>
  email: string
}

export function ProfileForm({ initial, email }: ProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>(null)
  const [form, setForm] = useState<ProfileInput>({
    full_name: initial.full_name ?? '',
    display_name: initial.display_name ?? '',
    bio: initial.bio ?? '',
    avatar_url: initial.avatar_url ?? '',
    phone: initial.phone ?? '',
    location: initial.location ?? '',
    website: initial.website ?? '',
    linkedin_url: initial.linkedin_url ?? '',
    github_url: initial.github_url ?? '',
    twitter_url: initial.twitter_url ?? '',
    youtube_url: initial.youtube_url ?? '',
  })

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const handleChange = (key: keyof ProfileInput, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await upsertProfile(form)
      if (result.success) {
        flash({ type: 'success', message: 'Profile saved.' })
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Failed to save.' })
      }
    })
  }

  const initials = (form.full_name || form.display_name || email)
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100'
              : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {status.message}
          </div>
          <button type="button" onClick={() => setStatus(null)} className="opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            {form.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatar_url}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {initials || 'U'}
              </div>
            )}
            <div className="flex-1">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={form.avatar_url ?? ''}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                placeholder="https://..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a hosted image URL. Square images work best.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={form.full_name ?? ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Chiranjivi Poudel"
              />
            </div>
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={form.display_name ?? ''}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="CP"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              value={form.bio ?? ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="A short summary of who you are and what you do."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location ?? ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Hamilton, New Zealand"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone ?? ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+64..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={form.website ?? ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://yourdomain.com"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn</Label>
            <Input
              id="linkedin_url"
              value={form.linkedin_url ?? ''}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <Label htmlFor="github_url">GitHub</Label>
            <Input
              id="github_url"
              value={form.github_url ?? ''}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <Label htmlFor="twitter_url">Twitter / X</Label>
            <Input
              id="twitter_url"
              value={form.twitter_url ?? ''}
              onChange={(e) => handleChange('twitter_url', e.target.value)}
              placeholder="https://x.com/..."
            />
          </div>
          <div>
            <Label htmlFor="youtube_url">YouTube</Label>
            <Input
              id="youtube_url"
              value={form.youtube_url ?? ''}
              onChange={(e) => handleChange('youtube_url', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
