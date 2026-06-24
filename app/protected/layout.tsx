import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"
import { AdminFooter } from "@/components/admin/admin-footer"
import { getPublicProfile } from "@/app/actions/profile-public"

const SUPERADMIN_EMAIL = "c.poudel1993@gmail.com"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  if (data.user.email !== SUPERADMIN_EMAIL) {
    redirect("/auth/unauthorized")
  }

  const profile = await getPublicProfile()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <AdminSidebar user={data.user} profile={profile} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top Navbar */}
        <AdminNavbar user={data.user} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  )
}
