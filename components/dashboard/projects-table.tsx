'use client'

import { useState } from 'react'
import type { Project, ProjectCategory } from '@/lib/db'
import {
  updateProject,
  deleteProject,
  createProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} from '@/lib/db'
import { ProjectForm } from './project-form'
import { Trash2, Edit2, FolderPlus, Upload, Loader2, X, Folder } from 'lucide-react'

interface ProjectsTableProps {
  projects: Project[]
  categories: ProjectCategory[]
  userId: string
}

export function ProjectsTable({ projects, categories, userId }: ProjectsTableProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Category state
  const [catName, setCatName] = useState('')
  const [catIconUrl, setCatIconUrl] = useState('')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editingCatOldName, setEditingCatOldName] = useState('')
  const [uploadingCat, setUploadingCat] = useState(false)
  const [savingCat, setSavingCat] = useState(false)
  const [catError, setCatError] = useState('')

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        setDeleting(id)
        await deleteProject(id)
        window.location.reload()
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete project')
      } finally {
        setDeleting(null)
      }
    }
  }

  const openEdit = (project: Project) => {
    setEditingProject(project)
    setShowForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- Category handlers ---------- */
  const resetCatForm = () => {
    setEditingCatId(null)
    setEditingCatOldName('')
    setCatName('')
    setCatIconUrl('')
    setCatError('')
  }

  const startEditCategory = (cat: ProjectCategory) => {
    setEditingCatId(cat.id)
    setEditingCatOldName(cat.name)
    setCatName(cat.name)
    setCatIconUrl(cat.icon_url || '')
    setCatError('')
  }

  const handleCatIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCat(true)
    setCatError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'project-categories')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }
      const { url } = await res.json()
      setCatIconUrl(url)
    } catch (err) {
      console.error('[v0] Category icon upload error:', err)
      setCatError(err instanceof Error ? err.message : 'Failed to upload logo')
    } finally {
      setUploadingCat(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!catName.trim()) return
    setSavingCat(true)
    setCatError('')
    try {
      if (editingCatId) {
        await updateProjectCategory(
          editingCatId,
          { name: catName.trim(), icon_url: catIconUrl || null },
          editingCatOldName
        )
      } else {
        await createProjectCategory({
          user_id: userId,
          name: catName.trim(),
          icon_url: catIconUrl || null,
          sort_order: categories.length + 1,
        })
      }
      window.location.reload()
    } catch (err) {
      console.error('[v0] Save category error:', err)
      setCatError(err instanceof Error ? err.message : 'Failed to save category')
      setSavingCat(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Projects assigned to it will remain but ungrouped.')) return
    try {
      await deleteProjectCategory(id)
      window.location.reload()
    } catch (err) {
      console.error('[v0] Delete category error:', err)
      alert('Failed to delete category')
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Category Management */}
      <div className="rounded-lg border border-border bg-muted/30 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Categories</h2>
          <span className="text-xs text-muted-foreground">Group your projects (IT, Computer, etc.)</span>
        </div>

        {/* Existing categories */}
        {categories.length > 0 && (
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                    {cat.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.icon_url || '/placeholder.svg'} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                  </div>
                  <span className="truncate text-sm font-medium">{cat.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => startEditCategory(cat)}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-destructive"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / edit category form */}
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-border bg-background p-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-primary/10 text-primary">
            {catIconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={catIconUrl || '/placeholder.svg'} alt="Logo preview" className="h-full w-full object-cover" />
            ) : (
              <FolderPlus className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium mb-1 text-muted-foreground">
              {editingCatId ? 'Edit category name' : 'New category name'}
            </label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. IT, Computer, Web Development"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <label className="inline-block cursor-pointer">
            <input type="file" accept="image/*" onChange={handleCatIconUpload} disabled={uploadingCat} className="hidden" />
            <span className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background hover:bg-muted transition-colors text-sm">
              {uploadingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploadingCat ? 'Uploading...' : 'Logo'}
            </span>
          </label>
          <button
            onClick={handleSaveCategory}
            disabled={savingCat || !catName.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
          >
            {savingCat ? 'Saving...' : editingCatId ? 'Update' : 'Add Category'}
          </button>
          {editingCatId && (
            <button
              onClick={resetCatForm}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Cancel edit"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {catError && <p className="mt-2 text-sm text-destructive">{catError}</p>}
      </div>

      {/* Projects header */}
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Projects</h2>
          <button
            onClick={() => {
              setEditingProject(null)
              setShowForm(!showForm)
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Project'}
          </button>
        </div>

        {/* Add form */}
        {showForm && !editingProject && (
          <ProjectForm userId={userId} categories={categories} onSuccess={() => window.location.reload()} />
        )}

        {/* Edit form */}
        {editingProject && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">
                Editing: <span className="text-primary">{editingProject.title}</span>
              </p>
              <button
                onClick={() => setEditingProject(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <ProjectForm
              userId={userId}
              project={editingProject}
              categories={categories}
              onSuccess={() => window.location.reload()}
            />
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No projects yet. Create one to get started!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
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
                      <div className="flex items-center gap-3">
                        {project.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image_url || '/placeholder.svg'}
                            alt={project.title}
                            className="h-10 w-14 shrink-0 rounded object-cover border border-border"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {project.category ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                          {project.category}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
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
                        onChange={async (e) => {
                          await updateProject(project.id, { featured: e.target.checked })
                          window.location.reload()
                        }}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(project)}
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
    </div>
  )
}
