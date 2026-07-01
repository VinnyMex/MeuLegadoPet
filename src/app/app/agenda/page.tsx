import { createClient } from '@/lib/supabase/server'
import { RequestAppointmentClient } from './request-client'
import { AgendaListClient } from './agenda-list-client'

export const dynamic = 'force-dynamic'

export default async function ClientAgenda() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pets } = await supabase.from('pets').select('id, name, status').eq('owner_id', user?.id)

  const { data: admin } = await supabase.from('profiles').select('phone').eq('role', 'admin').limit(1).single()
  const companyPhone = admin?.phone ? admin.phone.replace(/\D/g, '') : '5511999999999'

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, pets(name, avatar_url)')
    .eq('profile_id', user?.id)
    .order('appointment_date', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <RequestAppointmentClient pets={pets || []} />
      <AgendaListClient appointments={appointments || []} pets={pets || []} companyPhone={companyPhone} />
    </div>
  )
}
