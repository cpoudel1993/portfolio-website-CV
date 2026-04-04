'use client'

import { useState } from 'react'
import type { Certification } from '@/lib/db'
import { updateCertification, deleteCertification } from '@/lib/db'
import { Trash2, Edit2, ExternalLink } from 'lucide-react'

interface CertificationsTableProps {
  certifications: Certification[]
  userId: string
}

export function CertificationsTable({ certifications, userId }: CertificationsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      try {
        setDeleting(id)
        await deleteCertification(id)
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete certification')
      } finally {
        setDeleting(null)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Certifications</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          + Add Certification
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No certifications yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.platform}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-secondary rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    disabled={deleting === cert.id}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                {cert.type && (
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium text-xs">{cert.type}</p>
                  </div>
                )}
                {cert.date_earned && (
                  <div>
                    <p className="text-muted-foreground">Earned</p>
                    <p className="font-medium">{new Date(cert.date_earned).toLocaleDateString()}</p>
                  </div>
                )}
                {cert.duration && (
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium text-xs">{cert.duration}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-xs px-2 py-1 rounded bg-secondary w-fit">
                    {cert.status}
                  </p>
                </div>
              </div>

              {cert.skills && cert.skills.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs bg-muted px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                    {cert.skills.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">+{cert.skills.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {(cert.verify_url || cert.pdf_url) && (
                <div className="flex gap-2 pt-3 border-t border-border">
                  {cert.verify_url && (
                    <a
                      href={cert.verify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {cert.pdf_url && (
                    <a
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      PDF <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
