import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Award,
  Briefcase,
  Eye,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  const stats = [
    {
      title: "Total Visitors",
      value: "12,450",
      change: "+12.5%",
      icon: Eye,
      trend: "up",
    },
    {
      title: "Certifications",
      value: "14",
      change: "+2 new",
      icon: Award,
      trend: "up",
    },
    {
      title: "Experience",
      value: "8+ years",
      change: "Professional",
      icon: Briefcase,
      trend: "neutral",
    },
    {
      title: "Messages",
      value: "24",
      change: "5 unread",
      icon: MessageSquare,
      trend: "up",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, Superadmin
        </h2>
        <p className="text-muted-foreground">
          {"Here's an overview of your portfolio and recent activity."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Account Details Card */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your superadmin account information</CardDescription>
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
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm font-medium transition-colors hover:bg-muted">
                <Award className="h-5 w-5 text-primary" />
                Add Certification
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm font-medium transition-colors hover:bg-muted">
                <Briefcase className="h-5 w-5 text-primary" />
                Add Experience
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm font-medium transition-colors hover:bg-muted">
                <MessageSquare className="h-5 w-5 text-primary" />
                View Messages
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 p-4 text-sm font-medium transition-colors hover:bg-muted">
                <Users className="h-5 w-5 text-primary" />
                Manage Users
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
