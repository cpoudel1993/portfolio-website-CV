'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getContactMessages, deleteContactMessage } from '@/lib/db'
import { MessageDialog } from '@/components/dashboard/message-dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  let messages = []
  let fetchError = null

  try {
    messages = await getContactMessages()
  } catch (err) {
    console.error('Error fetching messages:', err)
    fetchError = 'Failed to load messages'
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length
  const totalCount = messages.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="mt-2 text-muted-foreground">
            Contact form messages and inquiries
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Total messages</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{unreadCount}</p>
            <p className="text-xs text-muted-foreground">Unread</p>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {fetchError}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12">
          <p className="text-center text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-medium">From</th>
                  <th className="px-6 py-3 text-left font-medium">Email</th>
                  <th className="px-6 py-3 text-left font-medium">Subject</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium">{message.full_name}</td>
                    <td className="px-6 py-3 text-muted-foreground text-xs">{message.email}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {message.subject || '(no subject)'}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          message.status === 'read'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}
                      >
                        {message.status === 'read' ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <MessageDialog message={message} />
                      <DeleteMessageButton messageId={message.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function DeleteMessageButton({ messageId }: { messageId: string }) {
  async function handleDelete() {
    'use server'
    try {
      await deleteContactMessage(messageId)
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className="text-xs font-medium text-red-600 hover:underline"
        title="Delete message"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  )
}

