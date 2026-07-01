import { createClient } from '@/lib/supabase/server'
import FinanceiroClient from './financeiro-client'

export const dynamic = 'force-dynamic'

export default async function MasterFinanceiro() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, profiles(full_name), pets(name)')
    .in('status', ['agendado', 'concluido'])
    .order('appointment_date', { ascending: false })

  return <FinanceiroClient initialAppointments={appointments || []} />
}
