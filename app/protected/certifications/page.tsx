'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CertificationManager } from '@/components/admin/certification-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export default async function CertificationsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  // Fetch certifications
  const { data: certifications, error: fetchError } = await supabase
    .from('certifications')
    .select('*')
    .eq('user_id', data.user.id)
    .order('display_order', { ascending: true })
    .order('date_earned', { ascending: false })

  if (fetchError) {
    console.error('Error fetching certifications:', fetchError)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
        <p className="mt-2 text-muted-foreground">Manage your professional certifications and training</p>
      </div>

      <CertificationManager 
        certifications={certifications || []} 
        userId={data.user.id} 
      />
    </div>
  )
}
