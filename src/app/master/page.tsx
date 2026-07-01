import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Dog, Calendar as CalendarIcon, DollarSign } from 'lucide-react'
import { AppointmentsList } from './appointments-list'

export const dynamic = 'force-dynamic'

export default async function MasterDashboard() {
  const supabase = await createClient()

  // Buscar totais (Simples counts)
  const { count: clientsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client')
  const { count: petsCount } = await supabase.from('pets').select('*', { count: 'exact', head: true })
  
  // Buscar agendamentos de hoje/futuros com relacoes
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, pets(name, avatar_url), profiles(full_name, phone)')
    .gte('appointment_date', new Date().toISOString().split('T')[0])
    .order('appointment_date', { ascending: true })
  
  const confirmedAppointments = appointments?.filter((a: any) => a.status === 'agendado' || a.status === 'concluido') || []
  const pendingRevenue = confirmedAppointments.filter((a: any) => a.payment_status === 'pendente' && a.price).reduce((acc: number, curr: any) => acc + Number(curr.price), 0) || 0
  const completedRevenue = confirmedAppointments.filter((a: any) => a.payment_status === 'pago' && a.price).reduce((acc: number, curr: any) => acc + Number(curr.price), 0) || 0

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Visão Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pets Registrados</CardTitle>
            <Dog className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{petsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Agenda Ativa</CardTitle>
            <CalendarIcon className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments?.length || 0}</div>
            <p className="text-xs text-gray-500">Agendamentos futuros</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Faturamento Previsto</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ {pendingRevenue.toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-gray-500">Pendente de pagamento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado a lado */}
        <AppointmentsList appointments={appointments || []} />
      </div>
    </div>
  )
}
