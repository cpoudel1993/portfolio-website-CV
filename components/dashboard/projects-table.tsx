'use client'

import { useState } from 'react'
import type { Project } from '@/lib/db'
import { updateProject, deleteProject, createProject } from '@/lib/db'
import { ProjectForm } from './project-form'
import { Trash2, Edit2 } from 'lucide-react'

interface ProjectsTableProps {
  projects: Project[]
  userId: string
}

export function ProjectsTable({ projects, userId }: ProjectsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setDeleting(id)
        await deleteProject(id)
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete project')
      } finally {
        setDeleting(null)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      {showForm && <ProjectForm userId={userId} onSuccess={() => setShowForm(false)} />}

      {projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No projects yet. Create one to get started!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Technologies</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Featured</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 2).map((tech) => (
                        <span key={tech} className="text-xs bg-secondary px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                      {(project.technologies?.length || 0) > 2 && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          +{(project.technologies?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        project.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : project.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={project.featured}
                      onChange={(e) =>
                        updateProject(project.id, { ...project, featured: e.target.checked })
                      }
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(editingId === project.id ? null : project.id)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
