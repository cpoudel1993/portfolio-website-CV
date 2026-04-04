'use client'

import { useState } from 'react'
import { createExperience, updateExperience } from '@/lib/db'
import type { Experience } from '@/lib/db'

interface ExperienceFormProps {
  userId: string
  experience?: Experience
  onSuccess: () => void
}

export function ExperienceForm({ userId, experience, onSuccess }: ExperienceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    company: experience?.company || '',
    position: experience?.position || '',
    location: experience?.location || '',
    start_date: experience?.start_date || '',
    end_date: experience?.end_date || '',
    description: experience?.description || '',
    responsibilities: (experience?.responsibilities || []).join('\n'),
    is_current: experience?.is_current || false,
    status: (experience?.status || 'published') as 'draft' | 'published' | 'archived',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const responsibilities = formData.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r)

      const experienceData = {
        ...formData,
        responsibilities,
        user_id: userId,
      }

      if (experience?.id) {
        await updateExperience(experience.id, experienceData)
      } else {
        await createExperience(experienceData)
      }

      onSuccess()
    } catch (err) {
      console.error('[v0] Form error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save experience')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Position *</label>
          <input
            type="text"
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job position"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Start Date *</label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            disabled={formData.is_current}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_current"
            checked={formData.is_current}
            onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="is_current" className="text-sm font-medium cursor-pointer">
            Currently working here
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Job description"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Responsibilities (one per line)</label>
          <textarea
            value={formData.responsibilities}
            onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            placeholder="- Responsibility 1&#10;- Responsibility 2"
            rows={4}
          />
        </div>
      </div>

      {error && <div className="text-sm text-destructive mb-4">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
        </button>
      </div>
    </form>
  )
}
