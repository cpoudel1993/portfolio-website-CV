import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, LogOut, Shield } from "lucide-react"

const SUPERADMIN_EMAIL = "c.poudel1993@gmail.com"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  if (data.user.email !== SUPERADMIN_EMAIL) {
    redirect("/auth/unauthorized")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-lg">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Button>
        </Link>

        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-xl p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Superadmin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              {"You're authenticated as a superadmin."}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Account Details
            </p>
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Email: </span>
                {data.user.email}
              </p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">ID: </span>
                <span className="font-mono text-xs">{data.user.id}</span>
              </p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Last sign in: </span>
                {data.user.last_sign_in_at
                  ? new Date(data.user.last_sign_in_at).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <Button
              variant="outline"
              className="w-full gap-2 text-muted-foreground hover:text-foreground"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
