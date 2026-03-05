import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-destructive/5">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground">
            You do not have superadmin privileges to access this page.
            Only authorized administrators can view this dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <form action="/auth/signout" method="post">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              type="submit"
            >
              Sign out and try another account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
