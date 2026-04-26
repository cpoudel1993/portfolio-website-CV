import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GalleryManager } from "@/components/dashboard/gallery-manager"

export const dynamic = "force-dynamic"

export default async function AdminGalleryPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect("/auth/login?next=/protected/gallery")
  }

  const { data: photos, error } = await supabase
    .from("gallery_photos")
    .select(
      "id, title, location, year, category, image_url, alt, status, sort_order, storage_path, created_at, updated_at"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] admin gallery fetch error:", error.message)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your photography collection. Uploads go straight to Supabase Storage.
        </p>
      </div>

      <GalleryManager
        initialPhotos={photos ?? []}
        userId={userData.user.id}
      />
    </div>
  )
}
