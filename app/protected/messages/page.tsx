import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ContactMessage } from '@/lib/db'
import { MessagesManager } from '@/components/admin/messages-manager'

const SUPERADMIN_EMAIL = 'c.poudel1993@gmail.com'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user || data.user.email !== SUPERADMIN_EMAIL) {
    redirect('/auth/unauthorized')
  }

  const { data: messagesData, error: fetchError } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    console.error('Error fetching messages:', fetchError)
  }

  const messages = (messagesData || []) as ContactMessage[]

  return <MessagesManager initialMessages={messages} />
}
