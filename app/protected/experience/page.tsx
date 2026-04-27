'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExperienceManager } from '@/components/admin/experience-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function ExperiencePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  // Fetch experiences
  const { data: experiences, error: fetchError } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', data.user.id)
    .order('display_order', { ascending: true })
    .order('start_date', { ascending: false })

  if (fetchError) {
    console.error('Error fetching experiences:', fetchError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
        <p className="mt-2 text-muted-foreground">Manage your work experience entries</p>
      </div>

      <ExperienceManager 
        experiences={experiences || []} 
        userId={data.user.id} 
      />
    </div>
  )
}
