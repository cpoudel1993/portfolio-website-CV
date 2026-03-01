"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session && session.user) {
        setUser(session.user)
      } else {
        router.replace("/login")
      }
      setLoading(false)
    }
    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === "SIGNED_OUT") {
        router.replace("/login")
      }
      if (sess && sess.user) {
        setUser(sess.user)
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
        >
          Logout
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Profile</h2>
          <p>Email: {user?.email}</p>
          {user?.user_metadata?.username && (
            <p>Username: {user.user_metadata.username}</p>
          )}
          <p>User ID: {user?.id}</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <p>Placeholder for admin actions or reports.</p>
        </div>
      </section>
    </div>
  )
}
