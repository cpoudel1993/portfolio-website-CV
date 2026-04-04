'use client'

import { useState } from 'react'
import type { Experience } from '@/lib/db'
import { updateExperience, deleteExperience } from '@/lib/db'
import { Trash2, Edit2 } from 'lucide-react'

interface ExperiencesTableProps {
  experiences: Experience[]
  userId: string
}

export function ExperiencesTable({ experiences, userId }: ExperiencesTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        setDeleting(id)
        await deleteExperience(id)
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete experience')
      } finally {
        setDeleting(null)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Experiences</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          + Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No experiences yet.</div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-secondary rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deleting === exp.id}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(exp.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {exp.is_current ? 'Current' : exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{exp.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-xs px-2 py-1 rounded bg-secondary w-fit">
                    {exp.status}
                  </p>
                </div>
              </div>

              {exp.description && <p className="text-sm text-muted-foreground mb-2">{exp.description}</p>}

              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Responsibilities:</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                    {exp.responsibilities.length > 3 && <li>+{exp.responsibilities.length - 3} more</li>}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
