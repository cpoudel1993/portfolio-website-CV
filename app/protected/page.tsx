import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Award,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Users,
  Image as ImageIcon,
  FileText,
  Calendar,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // Fetch real data from Supabase
  let stats = {
    certifications: 0,
    experience: 0,
    messages: 0,
    unreadMessages: 0,
    projects: 0,
    galleryPhotos: 0,
    blogPosts: 0,
  }

  try {
    // Get certifications count
    const { count: certCount } = await supabase
      .from('certifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get experience count
    const { count: expCount } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get messages counts
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })

    const { count: unreadCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)

    // Get projects count
    const { count: projCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get gallery photos count
    const { count: photoCount } = await supabase
      .from('gallery_photos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get blog posts count
    const { count: postCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    stats = {
      certifications: certCount || 0,
      experience: expCount || 0,
      messages: msgCount || 0,
      unreadMessages: unreadCount || 0,
      projects: projCount || 0,
      galleryPhotos: photoCount || 0,
      blogPosts: postCount || 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }

  const dashboardCards = [
    {
      title: "Certifications",
      value: stats.certifications.toString(),
      icon: Award,
      href: "/protected/certifications",
    },
    {
      title: "Experience",
      value: stats.experience.toString(),
      icon: Briefcase,
      href: "/protected/experience",
    },
    {
      title: "Messages",
      value: stats.messages.toString(),
      change: `${stats.unreadMessages} unread`,
      icon: MessageSquare,
      href: "/protected/messages",
    },
    {
      title: "Projects",
      value: stats.projects.toString(),
      icon: Calendar,
      href: "/protected/projects",
    },
    {
      title: "Gallery Photos",
      value: stats.galleryPhotos.toString(),
      icon: ImageIcon,
      href: "/protected/gallery",
    },
    {
      title: "Blog Posts",
      value: stats.blogPosts.toString(),
      icon: FileText,
      href: "/protected/blog-posts",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {data?.user?.email?.split('@')[0] || 'Admin'}
        </h2>
        <p className="text-muted-foreground">
          {"Here's an overview of your portfolio and recent activity."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="border-border bg-card cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                {card.change && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {card.change}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Account Details Card */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your admin account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">{data?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-xs font-mono text-foreground">{data?.user?.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium text-primary">Superadmin</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Last Sign In</span>
              <span className="text-sm font-medium text-foreground">
                {data?.user?.last_sign_in_at
                  ? new Date(data.user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/protected/certifications">
                <Button 
                  variant="outline" 
                  className="w-full h-auto flex flex-col items-center justify-center gap-2 rounded-lg p-4"
                >
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Add Certification</span>
                </Button>
              </Link>
              <Link href="/protected/experience">
                <Button 
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center gap-2 rounded-lg p-4"
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Add Experience</span>
                </Button>
              </Link>
              <Link href="/protected/messages">
                <Button 
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center gap-2 rounded-lg p-4"
                >
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">View Messages</span>
                </Button>
              </Link>
              <Link href="/protected/gallery">
                <Button 
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center justify-center gap-2 rounded-lg p-4"
                >
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Gallery</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
