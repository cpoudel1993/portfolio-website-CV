'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SkillsManager } from '@/components/admin/skills-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const { data: skills, error: fetchError } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', data.user.id)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (fetchError) {
    console.error('[v0] Error fetching skills:', fetchError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <p className="mt-2 text-muted-foreground">Manage your technical and professional skills</p>
      </div>

      <SkillsManager skills={skills || []} userId={data.user.id} />
    </div>
  )
}
