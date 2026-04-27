'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Pencil,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Link as LinkIcon,
  Search,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
  type MenuItem,
  type MenuItemInput,
} from '@/app/actions/menu'

type Status = { type: 'success' | 'error'; message: string } | null

const emptyForm: MenuItemInput = {
  label: '',
  href: '',
  anchor: '',
  icon: '',
  sort_order: 0,
  is_external: false,
  is_active: true,
  location: 'main',
}

export function MenuManager({ items: initialItems }: { items: MenuItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState<'all' | 'main' | 'footer' | 'admin'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<MenuItemInput>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>(null)

  const items = initialItems

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (locationFilter !== 'all' && item.location !== locationFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !item.label.toLowerCase().includes(q) &&
          !item.href.toLowerCase().includes(q) &&
          !(item.anchor || '').toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [items, search, locationFilter])

  const counts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.is_active).length,
      hidden: items.filter((i) => !i.is_active).length,
      external: items.filter((i) => i.is_external).length,
    }),
    [items],
  )

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const openNew = () => {
    setEditing(null)
    const nextSort = items.length ? Math.max(...items.map((i) => i.sort_order)) + 10 : 10
    setForm({ ...emptyForm, sort_order: nextSort })
    setDialogOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditing(item)
    setForm({
      label: item.label,
      href: item.href,
      anchor: item.anchor ?? '',
      icon: item.icon ?? '',
      sort_order: item.sort_order,
      is_external: item.is_external,
      is_active: item.is_active,
      location: item.location,
    })
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label.trim() || !form.href.trim()) {
      flash({ type: 'error', message: 'Label and link are required.' })
      return
    }
    startTransition(async () => {
      const result = editing
        ? await updateMenuItem(editing.id, form)
        : await createMenuItem(form)
      if (result.success) {
        flash({ type: 'success', message: editing ? 'Menu item updated.' : 'Menu item created.' })
        setDialogOpen(false)
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Operation failed.' })
      }
    })
  }

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteMenuItem(deleteId)
      if (result.success) {
        flash({ type: 'success', message: 'Menu item deleted.' })
        setDeleteId(null)
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Failed to delete.' })
      }
    })
  }

  const handleToggleActive = (item: MenuItem) => {
    startTransition(async () => {
      const result = await updateMenuItem(item.id, { is_active: !item.is_active })
      if (result.success) {
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Failed to toggle.' })
      }
    })
  }

  const handleMove = (item: MenuItem, direction: 'up' | 'down') => {
    const sameLocation = items
      .filter((i) => i.location === item.location)
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = sameLocation.findIndex((i) => i.id === item.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sameLocation.length) return
    const other = sameLocation[swapIdx]

    startTransition(async () => {
      const result = await reorderMenuItems([
        { id: item.id, sort_order: other.sort_order },
        { id: other.id, sort_order: item.sort_order },
      ])
      if (result.success) {
        router.refresh()
      } else {
        flash({ type: 'error', message: result.error || 'Failed to reorder.' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Configuration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, reorder, or hide navigation links across your public site.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Menu Item
        </Button>
      </div>

      {/* Status Banner */}
      {status && (
        <div
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100'
              : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {status.message}
          </div>
          <button onClick={() => setStatus(null)} className="opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={counts.total} />
        <StatCard label="Active" value={counts.active} />
        <StatCard label="Hidden" value={counts.hidden} />
        <StatCard label="External" value={counts.external} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by label, link, or anchor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v as typeof locationFilter)}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            <SelectItem value="main">Main navigation</SelectItem>
            <SelectItem value="footer">Footer</SelectItem>
            <SelectItem value="admin">Admin only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Label</th>
                <th className="px-4 py-3 text-left font-medium">Link</th>
                <th className="px-4 py-3 text-left font-medium">Anchor</th>
                <th className="px-4 py-3 text-left font-medium">Location</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No menu items match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 ${
                      !item.is_active ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-muted px-2 text-xs font-medium">
                          {item.sort_order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMove(item, 'up')}
                            disabled={isPending}
                            className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMove(item, 'down')}
                            disabled={isPending}
                            className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{item.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {item.is_external ? (
                          <ExternalLink className="h-3 w-3" />
                        ) : (
                          <LinkIcon className="h-3 w-3" />
                        )}
                        <span className="max-w-[260px] truncate">{item.href}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.anchor || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">
                        {item.location}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                          <Eye className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(item)}
                          disabled={isPending}
                          title={item.is_active ? 'Hide' : 'Show'}
                        >
                          {item.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                          disabled={isPending}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id)}
                          disabled={isPending}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Menu Item' : 'New Menu Item'}</DialogTitle>
            <DialogDescription>
              Configure how this link appears in your site navigation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="About"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="href">Link *</Label>
                <Input
                  id="href"
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  placeholder="/about or https://..."
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="anchor">Anchor (optional)</Label>
                <Input
                  id="anchor"
                  value={form.anchor || ''}
                  onChange={(e) => setForm({ ...form, anchor: e.target.value })}
                  placeholder="#about"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  When on the homepage, the link scrolls to this section.
                </p>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={form.location}
                  onValueChange={(v) => setForm({ ...form, location: v as MenuItemInput['location'] })}
                >
                  <SelectTrigger id="location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main navigation</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="admin">Admin only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort_order">Sort order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                />
              </div>

              <div className="col-span-2 flex flex-col gap-3 sm:flex-row sm:gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  Active (visible in nav)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_external}
                    onChange={(e) => setForm({ ...form, is_external: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  External link (opens new tab)
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : editing ? 'Save changes' : 'Create item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              The link will be removed from the public site. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  )
}
