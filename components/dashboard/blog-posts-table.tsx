'use client'

import { useState } from 'react'
import type { BlogPost } from '@/lib/db'
import { updateBlogPost, deleteBlogPost } from '@/lib/db'
import { Trash2, Edit2 } from 'lucide-react'

interface BlogPostsTableProps {
  posts: BlogPost[]
  userId: string
}

export function BlogPostsTable({ posts, userId }: BlogPostsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        setDeleting(id)
        await deleteBlogPost(id)
      } catch (error) {
        console.error('[v0] Delete error:', error)
        alert('Failed to delete blog post')
      } finally {
        setDeleting(null)
      }
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Blog Posts</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          + Add Blog Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No blog posts yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Title</th>
                <th className="text-left py-3 px-4 font-semibold">Slug</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Published</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-secondary px-2 py-1 rounded">{post.slug}</code>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : post.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-secondary rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
