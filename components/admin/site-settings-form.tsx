'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { upsertSiteSettings } from '@/app/actions/site-settings'

type Status = { type: 'success' | 'error'; message: string } | null

interface SettingsFormProps {
  initial: Record<string, string>
  email: string
}

const TOGGLE_KEYS = ['enable_blog', 'enable_contact_form', 'enable_analytics'] as const

export function SiteSettingsForm({ initial, email }: SettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>(null)
  const [values, setValues] = useState<Record<string, string>>({
    site_title: initial.site_title ?? 'Chiranjivi Poudel | Portfolio',
    site_description: initial.site_description ?? '',
    contact_email: initial.contact_email ?? email,
    enable_blog: initial.enable_blog ?? 'true',
    enable_contact_form: initial.enable_contact_form ?? 'true',
    enable_analytics: initial.enable_analytics ?? 'true',
  })

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const handleChange = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
  }

  const toggle = (key: string) => {
    setValues((v) => ({ ...v, [key]: v[key] === 'true' ? 'false' : 'true' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await upsertSiteSettings(values)
      if (result.success) {
        flash({ type: 'success', message: 'Settings saved.' })
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Failed to save.' })
      }
    })
  }

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

      {/* Account */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Account</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="account_email">Email</Label>
            <Input id="account_email" value={email} disabled className="bg-muted" />
            <p className="mt-1 text-xs text-muted-foreground">
              To change your login email, update it in Supabase auth.
            </p>
          </div>
          <div>
            <Label htmlFor="contact_email">Public contact email</Label>
            <Input
              id="contact_email"
              type="email"
              value={values.contact_email ?? ''}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="hello@yourdomain.com"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Shown on the public contact page.
            </p>
          </div>
        </div>
      </div>

      {/* Site */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Site</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="site_title">Site title</Label>
            <Input
              id="site_title"
              value={values.site_title ?? ''}
              onChange={(e) => handleChange('site_title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="site_description">Site description</Label>
            <Textarea
              id="site_description"
              rows={3}
              value={values.site_description ?? ''}
              onChange={(e) => handleChange('site_description', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Features</h2>
        <div className="space-y-1">
          <ToggleRow
            label="Enable Blog"
            description="Show blog posts on your portfolio."
            checked={values.enable_blog === 'true'}
            onToggle={() => toggle('enable_blog')}
          />
          <div className="my-2 border-t border-border" />
          <ToggleRow
            label="Enable Contact Form"
            description="Allow visitors to send you messages."
            checked={values.enable_contact_form === 'true'}
            onToggle={() => toggle('enable_contact_form')}
          />
          <div className="my-2 border-t border-border" />
          <ToggleRow
            label="Enable Analytics"
            description="Track page views and basic visitor metrics."
            checked={values.enable_analytics === 'true'}
            onToggle={() => toggle('enable_analytics')}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string
  description: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
