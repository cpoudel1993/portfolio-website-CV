'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Wrench, Upload, Loader2, FolderPlus } from 'lucide-react'
import {
  createSkill,
  updateSkill,
  deleteSkill,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/app/actions/skill'

interface Skill {
  id: string
  user_id: string
  name: string
  category: string
  proficiency: string
  status: string
}

interface Category {
  id: string
  user_id: string
  name: string
  icon_url: string | null
  sort_order: number
}

interface SkillsManagerProps {
  skills: Skill[]
  categories: Category[]
  userId: string
}

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export function SkillsManager({ skills, categories, userId }: SkillsManagerProps) {
  const categoryNames = categories.map((c) => c.name)

  const emptySkill = {
    name: '',
    category: categoryNames[0] || '',
    proficiency: 'Intermediate',
    status: 'published',
  }

  // Skill dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(emptySkill)

  // Skill delete state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Category dialog state
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [editingCatOldName, setEditingCatOldName] = useState<string>('')
  const [catForm, setCatForm] = useState<{ name: string; icon_url: string }>({ name: '', icon_url: '' })
  const [isCatSaving, setIsCatSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Category delete state
  const [isCatDeleteOpen, setIsCatDeleteOpen] = useState(false)
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null)

  /* ---------- Skill handlers ---------- */
  const openCreateDialog = () => {
    setEditingId(null)
    setFormData(emptySkill)
    setIsDialogOpen(true)
  }

  const openEditDialog = (skill: Skill) => {
    setEditingId(skill.id)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      status: skill.status,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        user_id: userId,
        name: formData.name,
        category: formData.category,
        proficiency: formData.proficiency,
        status: formData.status,
      }
      if (editingId) {
        await updateSkill(editingId, payload)
      } else {
        await createSkill(payload)
      }
      setIsDialogOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('[v0] Error saving skill:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSkill(deleteId)
      setIsDeleteOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('[v0] Error deleting skill:', error)
    }
  }

  /* ---------- Category handlers ---------- */
  const openCreateCategory = () => {
    setEditingCatId(null)
    setEditingCatOldName('')
    setCatForm({ name: '', icon_url: '' })
    setIsCatDialogOpen(true)
  }

  const openEditCategory = (cat: Category) => {
    setEditingCatId(cat.id)
    setEditingCatOldName(cat.name)
    setCatForm({ name: cat.name, icon_url: cat.icon_url || '' })
    setIsCatDialogOpen(true)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'skill-categories')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }
      const { url } = await res.json()
      setCatForm((prev) => ({ ...prev, icon_url: url }))
    } catch (err) {
      console.error('[v0] Logo upload error:', err)
      alert(err instanceof Error ? err.message : 'Failed to upload logo')
    } finally {
      setUploading(false)
    }
  }

  const handleCatSave = async () => {
    setIsCatSaving(true)
    try {
      const payload = {
        user_id: userId,
        name: catForm.name,
        icon_url: catForm.icon_url || null,
        sort_order: categories.length + 1,
      }
      if (editingCatId) {
        await updateCategory(editingCatId, { name: catForm.name, icon_url: catForm.icon_url || null }, editingCatOldName)
      } else {
        await createCategory(payload)
      }
      setIsCatDialogOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('[v0] Error saving category:', error)
    } finally {
      setIsCatSaving(false)
    }
  }

  const handleCatDelete = async () => {
    if (!deleteCatId) return
    try {
      await deleteCategory(deleteCatId)
      setIsCatDeleteOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('[v0] Error deleting category:', error)
    }
  }

  // Group skills by their managed category
  const grouped = categories.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.name),
  }))

  return (
    <>
      {/* Category Management */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Categories</h2>
            <p className="text-sm text-muted-foreground">Main skill sections with logos</p>
          </div>
          <Button variant="outline" size="sm" onClick={openCreateCategory}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No categories yet. Add one to get started.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                    {cat.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cat.icon_url || "/placeholder.svg"} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <Wrench className="h-4 w-4" />
                    )}
                  </div>
                  <span className="truncate text-sm font-medium text-foreground">{cat.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCategory(cat)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      setDeleteCatId(cat.id)
                      setIsCatDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="flex justify-end">
        <Button onClick={openCreateDialog} disabled={categories.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No skills yet.</p>
          <Button variant="outline" className="mt-4" onClick={openCreateDialog} disabled={categories.length === 0}>
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((category) => (
            <div key={category.id} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                  {category.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={category.icon_url || "/placeholder.svg"} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <Wrench className="h-4 w-4" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <span className="text-xs text-muted-foreground">({category.skills.length})</span>
              </div>

              {category.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">No skills in this category yet.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{skill.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary">{skill.proficiency}</span>
                          {skill.status !== 'published' && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                              {skill.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(skill)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setDeleteId(skill.id)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skill Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update this skill' : 'Add a new skill to your portfolio'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. AutoCAD"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryNames.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proficiency">Proficiency</Label>
                <Select value={formData.proficiency} onValueChange={(v) => setFormData({ ...formData, proficiency: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.name || !formData.category}>
              {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Create/Edit Dialog */}
      <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCatId ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCatId ? 'Update this category title and logo' : 'Create a new skill category with a logo'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Category Title *</Label>
              <Input
                id="cat-name"
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                placeholder="e.g. Production & Food Safety"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Logo</Label>
              <div className="mt-1.5 flex items-end gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-primary/10 text-primary">
                  {catForm.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={catForm.icon_url || "/placeholder.svg"} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <Wrench className="h-6 w-6" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} className="hidden" />
                  <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                    <span className="flex items-center gap-2">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCatSave} disabled={isCatSaving || !catForm.name}>
              {isCatSaving ? 'Saving...' : editingCatId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Delete Confirmation */}
      <AlertDialog open={isCatDeleteOpen} onOpenChange={setIsCatDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? Skills assigned to it will remain but won&apos;t be grouped
              until reassigned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCatDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
