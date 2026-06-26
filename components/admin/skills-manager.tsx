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
import { Plus, Edit, Trash2, Wrench } from 'lucide-react'
import { createSkill, updateSkill, deleteSkill } from '@/app/actions/skill'

interface Skill {
  id: string
  user_id: string
  name: string
  category: string
  proficiency: string
  status: string
}

interface SkillsManagerProps {
  skills: Skill[]
  userId: string
}

const CATEGORIES = [
  'Production & Food Safety',
  'Construction & Surveying',
  'Drafting & Design',
  'Software & Digital',
  'Teamwork & Reliability',
  'Technical & Hardware',
]

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const emptySkill = {
  name: '',
  category: CATEGORIES[0],
  proficiency: 'Intermediate',
  status: 'published',
}

export function SkillsManager({ skills, userId }: SkillsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(emptySkill)

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

  const openDeleteDialog = (id: string) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
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

  // Group skills by category for display
  const grouped = CATEGORIES.map((cat) => ({
    name: cat,
    skills: skills.filter((s) => s.category === cat),
  })).filter((g) => g.skills.length > 0)

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No skills yet.</p>
          <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((category) => (
            <div key={category.name} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wrench className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <span className="text-xs text-muted-foreground">({category.skills.length})</span>
              </div>

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
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDeleteDialog(skill.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
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
            <Button onClick={handleSave} disabled={isSaving || !formData.name}>
              {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
    </>
  )
}
