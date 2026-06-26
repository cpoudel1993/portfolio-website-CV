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
import { Plus, Edit, Trash2, Award, Clock, ExternalLink, FileText, Upload, Loader2 } from 'lucide-react'
import { createCertification, updateCertification, deleteCertification } from '@/app/actions/certification'

interface Certification {
  id: string
  user_id: string
  title: string
  platform: string
  type: string | null
  date_earned: string | null
  duration: string | null
  skills: string[] | null
  cert_id: string | null
  pdf_url: string | null
  verify_url: string | null
  status: string
  display_order: number
}

interface CertificationManagerProps {
  certifications: Certification[]
  userId: string
}

const emptyCert = {
  title: '',
  platform: '',
  type: 'Certificate',
  date_earned: '',
  duration: '',
  skills: '',
  cert_id: '',
  pdf_url: '',
  verify_url: '',
  status: 'published',
  display_order: 0,
}

export function CertificationManager({ certifications, userId }: CertificationManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyCert)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file.')
      return
    }
    setUploadError(null)
    setIsUploading(true)
    try {
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('folder', 'certificates')

      const res = await fetch('/api/upload', { method: 'POST', body: uploadForm })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Upload failed')

      setFormData((prev) => ({ ...prev, pdf_url: result.url }))
    } catch (err) {
      console.error('[v0] PDF upload error:', err)
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const openCreateDialog = () => {
    setEditingId(null)
    setFormData({ ...emptyCert, display_order: certifications.length })
    setIsDialogOpen(true)
  }

  const openEditDialog = (cert: Certification) => {
    setEditingId(cert.id)
    setFormData({
      title: cert.title,
      platform: cert.platform,
      type: cert.type || 'Certificate',
      date_earned: cert.date_earned || '',
      duration: cert.duration || '',
      skills: cert.skills?.join(', ') || '',
      cert_id: cert.cert_id || '',
      pdf_url: cert.pdf_url || '',
      verify_url: cert.verify_url || '',
      status: cert.status,
      display_order: cert.display_order,
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
        title: formData.title,
        platform: formData.platform,
        type: formData.type || null,
        date_earned: formData.date_earned || null,
        duration: formData.duration || null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : null,
        cert_id: formData.cert_id || null,
        pdf_url: formData.pdf_url || null,
        verify_url: formData.verify_url || null,
        status: formData.status,
        display_order: formData.display_order,
      }

      if (editingId) {
        await updateCertification(editingId, payload)
      } else {
        await createCertification(payload)
      }
      setIsDialogOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error saving certification:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCertification(deleteId)
      setIsDeleteOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No certifications yet.</p>
          <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
            Add Your First Certification
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    cert.status === 'published' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-foreground text-sm line-clamp-2">{cert.title}</h3>
              <p className="text-xs text-primary mt-1">{cert.platform}</p>

              <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                {cert.type && <span className="bg-muted px-2 py-0.5 rounded">{cert.type}</span>}
                {cert.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cert.duration}
                  </span>
                )}
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {cert.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary">
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{cert.skills.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex gap-2">
                  {(cert.cert_id || cert.verify_url) && (
                    <a
                      href={cert.verify_url || `https://www.linkedin.com/learning/certificates/${cert.cert_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Verify
                    </a>
                  )}
                  {cert.pdf_url && (
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(cert)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(cert.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update this certification' : 'Add a new certification or training'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Certification name"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform *</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="LinkedIn Learning, Coursera..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Learning Path">Learning Path</SelectItem>
                    <SelectItem value="Specialization">Specialization</SelectItem>
                    <SelectItem value="Degree">Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date_earned">Date Earned</Label>
                <Input
                  id="date_earned"
                  type="date"
                  value={formData.date_earned}
                  onChange={(e) => setFormData({ ...formData, date_earned: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="10 hours"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Skill 1, Skill 2, Skill 3"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="cert_id">Certificate ID (for LinkedIn)</Label>
              <Input
                id="cert_id"
                value={formData.cert_id}
                onChange={(e) => setFormData({ ...formData, cert_id: e.target.value })}
                placeholder="LinkedIn certificate ID"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="verify_url">Verification URL</Label>
              <Input
                id="verify_url"
                value={formData.verify_url}
                onChange={(e) => setFormData({ ...formData, verify_url: e.target.value })}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="pdf_url">Certificate PDF</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  id="pdf_url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="Upload a PDF or paste a URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="flex-shrink-0 gap-1.5"
                  disabled={isUploading}
                  onClick={() => document.getElementById('pdf_file_input')?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload PDF'}
                </Button>
                <input
                  id="pdf_file_input"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
              </div>
              {uploadError && <p className="mt-1.5 text-xs text-destructive">{uploadError}</p>}
              {formData.pdf_url && !uploadError && (
                <a
                  href={formData.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <FileText className="h-3 w-3" />
                  Preview uploaded PDF
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.title || !formData.platform}>
              {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
