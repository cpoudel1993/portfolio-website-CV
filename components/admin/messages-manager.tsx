'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  Check,
  CheckCircle2,
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  Inbox,
  Mail,
  MailOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import type { ContactMessage } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createMessage,
  deleteMessageAction,
  setMessageStatus,
  updateMessage,
} from '@/app/actions/messages'

type FilterTab = 'all' | 'unread' | 'read' | 'archived'

interface MessagesManagerProps {
  initialMessages: ContactMessage[]
}

interface MessageFormValues {
  full_name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'archived'
}

const emptyForm: MessageFormValues = {
  full_name: '',
  email: '',
  subject: '',
  message: '',
  status: 'unread',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function StatusBadge({ status }: { status: ContactMessage['status'] }) {
  if (status === 'unread') {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
        Unread
      </Badge>
    )
  }
  if (status === 'read') {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300">
        Read
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground">
      Archived
    </Badge>
  )
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id || null
  )

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [formValues, setFormValues] = useState<MessageFormValues>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const showBanner = (type: 'success' | 'error', message: string) => {
    setStatusBanner({ type, message })
    setTimeout(() => setStatusBanner(null), 4000)
  }

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: initialMessages.length,
      unread: initialMessages.filter((m) => m.status === 'unread').length,
      read: initialMessages.filter((m) => m.status === 'read').length,
      archived: initialMessages.filter((m) => m.status === 'archived').length,
    }
  }, [initialMessages])

  // Filter & search
  const filteredMessages = useMemo(() => {
    let list = initialMessages
    if (activeTab !== 'all') {
      list = list.filter((m) => m.status === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.subject || '').toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      )
    }
    return list
  }, [initialMessages, activeTab, searchQuery])

  const selectedMessage = useMemo(
    () => initialMessages.find((m) => m.id === selectedId) || null,
    [initialMessages, selectedId]
  )

  // Actions
  const handleSelect = (message: ContactMessage) => {
    setSelectedId(message.id)
    // Auto-mark as read if currently unread
    if (message.status === 'unread') {
      startTransition(async () => {
        const result = await setMessageStatus(message.id, 'read')
        if (result.success) router.refresh()
      })
    }
  }

  const openCreateForm = () => {
    setFormMode('create')
    setFormValues(emptyForm)
    setFormError(null)
    setIsFormOpen(true)
  }

  const openEditForm = (message: ContactMessage) => {
    setFormMode('edit')
    setFormValues({
      full_name: message.full_name,
      email: message.email,
      subject: message.subject || '',
      message: message.message,
      status: message.status,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    startTransition(async () => {
      const result =
        formMode === 'create'
          ? await createMessage(formValues)
          : await updateMessage(selectedId!, formValues)

      if (result.success) {
        setIsFormOpen(false)
        showBanner(
          'success',
          formMode === 'create' ? 'Message created successfully.' : 'Message updated successfully.'
        )
        router.refresh()
      } else {
        setFormError(result.error || 'Something went wrong.')
      }
    })
  }

  const handleStatusChange = (status: 'unread' | 'read' | 'archived') => {
    if (!selectedMessage) return
    startTransition(async () => {
      const result = await setMessageStatus(selectedMessage.id, status)
      if (result.success) {
        showBanner('success', `Marked as ${status}.`)
        router.refresh()
      } else {
        showBanner('error', result.error || 'Failed to update status.')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteMessageAction(deleteId)
      if (result.success) {
        if (selectedId === deleteId) setSelectedId(null)
        setDeleteId(null)
        showBanner('success', 'Message deleted.')
        router.refresh()
      } else {
        showBanner('error', result.error || 'Failed to delete message.')
      }
    })
  }

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage contact form inquiries and add internal notes
          </p>
        </div>
        <Button onClick={openCreateForm} className="gap-2 self-start">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total"
          value={counts.all}
          icon={<Inbox className="h-4 w-4" />}
          accent="bg-muted text-foreground"
        />
        <StatCard
          label="Unread"
          value={counts.unread}
          icon={<Mail className="h-4 w-4" />}
          accent="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        />
        <StatCard
          label="Read"
          value={counts.read}
          icon={<MailOpen className="h-4 w-4" />}
          accent="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
        />
        <StatCard
          label="Archived"
          value={counts.archived}
          icon={<Archive className="h-4 w-4" />}
          accent="bg-secondary text-secondary-foreground"
        />
      </div>

      {/* Status Banner */}
      {statusBanner && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${
            statusBanner.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
          }`}
        >
          {statusBanner.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="flex-1">{statusBanner.message}</span>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-current opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'unread', 'read', 'archived'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {tab}
              <span
                className={`rounded-full px-1.5 text-[10px] font-semibold ${
                  activeTab === tab
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Message List */}
        <div
          className={`lg:col-span-5 xl:col-span-4 ${
            selectedMessage ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No messages</p>
                <p className="text-xs text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search or filters.'
                    : "You haven't received any messages yet."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border max-h-[640px] overflow-y-auto">
                {filteredMessages.map((message) => {
                  const isSelected = selectedId === message.id
                  const isUnread = message.status === 'unread'
                  return (
                    <li key={message.id}>
                      <button
                        onClick={() => handleSelect(message)}
                        className={`flex w-full flex-col gap-1 p-4 text-left transition-colors ${
                          isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                        } ${isSelected ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`truncate text-sm ${
                              isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                            }`}
                          >
                            {message.full_name}
                          </span>
                          <span className="flex-shrink-0 text-xs text-muted-foreground">
                            {formatShortDate(message.created_at)}
                          </span>
                        </div>
                        <p
                          className={`truncate text-xs ${
                            isUnread ? 'font-medium text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {message.subject || '(No subject)'}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {message.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {isUnread && (
                            <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                          )}
                          <StatusBadge status={message.status} />
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div
          className={`lg:col-span-7 xl:col-span-8 ${
            selectedMessage ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedMessage ? (
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {/* Mobile back button */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 p-3 lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedId(null)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to inbox
                </Button>
              </div>

              {/* Detail Header */}
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedMessage.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(selectedMessage.created_at)}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground break-words">
                    {selectedMessage.subject || '(No subject)'}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-medium text-foreground">{selectedMessage.full_name}</span>
                    <button
                      onClick={() => copyToClipboard(selectedMessage.email, 'email')}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-xs">{selectedMessage.email}</span>
                      {copiedField === 'email' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(selectedMessage)}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage.status === 'read' ? 'unread' : 'read'
                      )
                    }
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {selectedMessage.status === 'read' ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Mark unread
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Mark read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStatusChange(
                        selectedMessage.status === 'archived' ? 'read' : 'archived'
                      )
                    }
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {selectedMessage.status === 'archived' ? (
                      <>
                        <ArchiveRestore className="h-3.5 w-3.5" />
                        Unarchive
                      </>
                    ) : (
                      <>
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(selectedMessage.id)}
                    disabled={isPending}
                    className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-5">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="default" size="sm">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject || 'Your message'
                      )}`}
                      className="gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Reply via email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <Inbox className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">Select a message</p>
              <p className="text-xs text-muted-foreground">
                Choose a message from the list to view its details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? 'New Message' : 'Edit Message'}
            </DialogTitle>
            <DialogDescription>
              {formMode === 'create'
                ? 'Manually log an inquiry received outside the contact form.'
                : 'Update the message details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="form-name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="form-name"
                  required
                  value={formValues.full_name}
                  onChange={(e) =>
                    setFormValues({ ...formValues, full_name: e.target.value })
                  }
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="form-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="form-email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="form-subject">Subject</Label>
              <Input
                id="form-subject"
                value={formValues.subject}
                onChange={(e) =>
                  setFormValues({ ...formValues, subject: e.target.value })
                }
                disabled={isPending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="form-message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="form-message"
                required
                rows={6}
                value={formValues.message}
                onChange={(e) =>
                  setFormValues({ ...formValues, message: e.target.value })
                }
                disabled={isPending}
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="form-status">Status</Label>
              <Select
                value={formValues.status}
                onValueChange={(value) =>
                  setFormValues({
                    ...formValues,
                    status: value as 'unread' | 'read' | 'archived',
                  })
                }
                disabled={isPending}
              >
                <SelectTrigger id="form-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? 'Saving...'
                  : formMode === 'create'
                    ? 'Create Message'
                    : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently removed from your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-md ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
