import { createClient } from '@/lib/supabase/server'
import AgendaClient from './agenda-client'

export const dynamic = 'force-dynamic'

export default async function MasterAgenda() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, profiles(full_name), pets(name)')
    .neq('status', 'concluido')
    .order('appointment_date', { ascending: true })

  return <AgendaClient initialAppointments={appointments || []} />
}
