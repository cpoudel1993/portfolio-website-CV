'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateContactMessage } from '@/lib/db'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface MessageDialogProps {
  message: {
    id: string
    full_name: string
    email: string
    subject: string | null
    message: string
    status: 'unread' | 'read' | 'archived'
    created_at: string
  }
}

export function MessageDialog({ message }: MessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(message.status)
  const [isCopied, setIsCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleRead = async () => {
    setIsUpdating(true)
    try {
      const newStatus = status === 'read' ? 'unread' : 'read'
      await updateContactMessage(message.id, { status: newStatus })
      setStatus(newStatus)
    } catch (error) {
      console.error('Error updating message:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(message.email)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs font-medium text-blue-600 hover:underline"
          onClick={() => setIsOpen(true)}
        >
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>{message.subject || '(No Subject)'}</DialogTitle>
              <DialogDescription className="mt-2">
                From {message.full_name} ({message.email})
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleRead}
              disabled={isUpdating}
              className="flex-shrink-0"
            >
              {status === 'read' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="text-sm font-medium">{message.full_name}</p>
            </div>
            <button
              onClick={copyEmail}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Date</p>
            <p className="text-sm">
              {new Date(message.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                status === 'read'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}
            >
              {status === 'read' ? 'Read' : 'Unread'}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
