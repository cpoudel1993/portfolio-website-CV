'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, AlertCircle, Plus, Loader2 } from 'lucide-react'
import { changeUserPassword, createNewUser, deleteUser } from '@/app/actions/user-management'

type Status = { type: 'success' | 'error'; message: string } | null

export default function UsersPage() {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const flash = (s: Status) => {
    setStatus(s)
    if (s) setTimeout(() => setStatus(null), 4000)
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await createNewUser(newUserEmail, newUserPassword)
      if (result.success) {
        flash({ type: 'success', message: 'User created successfully' })
        setNewUserEmail('')
        setNewUserPassword('')
      } else {
        flash({ type: 'error', message: result.error || 'Failed to create user' })
      }
    })
  }

  const handleChangePassword = (userId: string) => {
    startTransition(async () => {
      const result = await changeUserPassword(userId, newPassword)
      if (result.success) {
        flash({ type: 'success', message: 'Password changed successfully' })
        setEditingUserId(null)
        setNewPassword('')
      } else {
        flash({ type: 'error', message: result.error || 'Failed to change password' })
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage admin users and their passwords for enhanced security</p>
      </div>

      {status && (
        <div className={`flex gap-3 rounded-lg p-4 ${status.type === 'success' ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
          {status.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          )}
          <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
            {status.message}
          </p>
        </div>
      )}

      {/* Create New User */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending} className="w-full gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Change User Password */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Change User Password</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Enter the User ID and new password to change an existing user's password.
        </p>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="user-id">User ID</Label>
              <Input
                id="user-id"
                value={editingUserId || ''}
                onChange={(e) => setEditingUserId(e.target.value)}
                placeholder="Paste user ID"
              />
            </div>
            <div>
              <Label htmlFor="new-pwd">New Password</Label>
              <Input
                id="new-pwd"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => editingUserId && handleChangePassword(editingUserId)}
                disabled={!editingUserId || !newPassword || isPending}
                className="w-full"
              >
                {isPending ? 'Updating...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Security Notes</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Passwords must be at least 6 characters long</li>
          <li>• Only admins with Supabase access can create or modify users</li>
          <li>• User IDs are available from your Supabase Auth dashboard</li>
          <li>• Keep passwords secure and never share them</li>
          <li>• Consider using strong, unique passwords for each admin account</li>
        </ul>
      </div>
    </div>
  )
}
