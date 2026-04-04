'use client'

import { useState } from 'react'
import { createProject, updateProject } from '@/lib/db'
import type { Project } from '@/lib/db'

interface ProjectFormProps {
  userId: string
  project?: Project
  onSuccess: () => void
}

export function ProjectForm({ userId, project, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image_url: project?.image_url || '',
    technologies: (project?.technologies || []).join(', '),
    live_url: project?.live_url || '',
    github_url: project?.github_url || '',
    featured: project?.featured || false,
    status: (project?.status || 'draft') as 'draft' | 'published' | 'archived',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const technologies = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t)

      const projectData = {
        ...formData,
        technologies,
        user_id: userId,
      }

      if (project?.id) {
        await updateProject(project.id, projectData)
      } else {
        await createProject(projectData)
      }

      onSuccess()
    } catch (err) {
      console.error('[v0] Form error:', err)
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Project description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="React, TypeScript, Tailwind"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Live URL</label>
          <input
            type="url"
            value={formData.live_url}
            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://github.com/..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
            Mark as featured
          </label>
        </div>
      </div>

      {error && <div className="text-sm text-destructive mb-4">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}
