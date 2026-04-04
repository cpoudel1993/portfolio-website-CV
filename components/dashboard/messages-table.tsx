'use client'

import { useState } from 'react'
import type { Message } from '@/lib/db'
import { updateMessage, deleteMessage } from '@/lib/db'
import { Trash2, Mail, Archive } from 'lucide-react'

interface MessagesTableProps {
  messages: Message[]
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        setDeleting(id)
        await deleteMessage(id)
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete message')
      } finally {
        setDeleting(null)
      }
    }
  }

  const handleMarkAsRead = async (message: Message) => {
    try {
      await updateMessage(message.id, { ...message, is_read: !message.is_read })
    } catch (error) {
      console.error('[v0] Update error:', error)
    }
  }

  const handleArchive = async (message: Message) => {
    try {
      await updateMessage(message.id, { ...message, is_archived: !message.is_archived })
    } catch (error) {
      console.error('[v0] Update error:', error)
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length
  const unarchivedMessages = messages.filter((m) => !m.is_archived)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <p className="text-sm text-muted-foreground">
          {unreadCount} unread • {unarchivedMessages.length} total
        </p>
      </div>

      {unarchivedMessages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No messages.</div>
      ) : (
        <div className="space-y-2">
          {unarchivedMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                !message.is_read ? 'bg-primary/5 border-primary/30' : ''
              }`}
            >
              <div
                onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                className="flex justify-between items-start"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!message.is_read && <div className="w-2 h-2 rounded-full bg-primary" />}
                    <h3 className={`font-semibold truncate ${!message.is_read ? 'font-bold' : ''}`}>
                      {message.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                  {message.subject && <p className="text-sm font-medium mt-1">{message.subject}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMarkAsRead(message)
                    }}
                    className={`p-2 rounded transition-colors ${
                      message.is_read
                        ? 'text-muted-foreground hover:bg-secondary'
                        : 'text-primary hover:bg-primary/10'
                    }`}
                    title={message.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleArchive(message)
                    }}
                    className="p-2 hover:bg-secondary rounded transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(message.id)
                    }}
                    disabled={deleting === message.id}
                    className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === message.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="bg-muted/50 p-3 rounded text-sm whitespace-pre-wrap break-words">
                    {message.message}
                  </div>
                  {message.replied_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Replied: {new Date(message.replied_at).toLocaleString()}
                    </p>
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
