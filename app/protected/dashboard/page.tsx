'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeData } from '@/hooks/useRealtimeData'
import { ProjectsTable } from '@/components/dashboard/projects-table'
import { ExperiencesTable } from '@/components/dashboard/experiences-table'
import { CertificationsTable } from '@/components/dashboard/certifications-table'
import { BlogPostsTable } from '@/components/dashboard/blog-posts-table'
import { MessagesTable } from '@/components/dashboard/messages-table'
import type { Project, Experience, Certification, BlogPost, Message } from '@/lib/db'
import { getProjects, getExperiences, getCertifications, getBlogPosts, getMessages } from '@/lib/db'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>('')
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
        await loadAllData()
      }
    }

    loadUser()
  }, [])

  async function loadAllData() {
    try {
      setIsLoading(true)
      const [projectsData, experiencesData, certificationsData, blogPostsData, messagesData] = await Promise.all([
        getProjects(),
        getExperiences(),
        getCertifications(),
        getBlogPosts(),
        getMessages(),
      ])

      setProjects(projectsData)
      setExperiences(experiencesData)
      setCertifications(certificationsData)
      setBlogPosts(blogPostsData)
      setMessages(messagesData)
    } catch (error) {
      console.error('[v0] Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time subscriptions
  useRealtimeData('projects', projects, setProjects)
  useRealtimeData('experiences', experiences, setExperiences)
  useRealtimeData('certifications', certifications, setCertifications)
  useRealtimeData('blog_posts', blogPosts, setBlogPosts)
  useRealtimeData('messages', messages, setMessages)

  const tabs = [
    { id: 'projects', label: 'Projects', count: projects.length },
    { id: 'experiences', label: 'Experiences', count: experiences.length },
    { id: 'certifications', label: 'Certifications', count: certifications.length },
    { id: 'blog', label: 'Blog Posts', count: blogPosts.length },
    { id: 'messages', label: 'Messages', count: messages.length },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage all your portfolio content with live updates</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && <ProjectsTable projects={projects} userId={userId} />}
              {activeTab === 'experiences' && <ExperiencesTable experiences={experiences} userId={userId} />}
              {activeTab === 'certifications' && <CertificationsTable certifications={certifications} userId={userId} />}
              {activeTab === 'blog' && <BlogPostsTable posts={blogPosts} userId={userId} />}
              {activeTab === 'messages' && <MessagesTable messages={messages} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
