'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DollarSign, ArrowUpRight, Clock, Search } from 'lucide-react'

export default function FinanceiroClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar transações financeiras reais (ignorando "solicitado" para receita pendente)
  const validFinancials = useMemo(() => {
    return initialAppointments.filter(app => app.price && app.status !== 'cancelado')
  }, [initialAppointments])

  const filteredFinancials = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()
    
    return validFinancials.filter(app => {
      const clientName = (app.profiles?.full_name || '').toLowerCase()
      const petName = (app.pets?.name || '').toLowerCase()
      const service = (app.service_type || '').toLowerCase()
      const method = (app.payment_method || '').toLowerCase()
      
      return clientName.includes(searchLower) || 
             petName.includes(searchLower) || 
             service.includes(searchLower) ||
             method.includes(searchLower)
    }).slice(0, 15) // Limit to last 15
  }, [validFinancials, searchTerm])

  const pendingRevenue = validFinancials
    .filter(a => a.payment_status === 'pendente' && a.status === 'agendado')
    .reduce((acc, curr) => acc + Number(curr.price), 0)
    
  const completedRevenue = validFinancials
    .filter(a => a.payment_status === 'pago')
    .reduce((acc, curr) => acc + Number(curr.price), 0)
    
  const totalRevenue = pendingRevenue + completedRevenue

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira (CRM)</h1>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar por cliente, pet, serviço ou forma..."
            className="pl-10 w-full bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">Receita Realizada (Paga)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">R$ {completedRevenue.toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Em caixa</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 bg-amber-50/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">A Receber (Confirmados)</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">R$ {pendingRevenue.toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-amber-600 mt-1">Serviços confirmados e não pagos</p>
          </CardContent>
        </Card>
        
        <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-900">Faturamento Previsto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">R$ {totalRevenue.toFixed(2).replace('.', ',')}</div>
            <p className="text-xs text-indigo-600 mt-1">Realizado + A Receber</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Últimas 15 Transações (Filtradas)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Data/Hora (BRT)</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Pet</th>
                  <th className="px-6 py-3">Serviço Realizado</th>
                  <th className="px-6 py-3">Valor</th>
                  <th className="px-6 py-3">Forma de Pag.</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFinancials.map((app: any) => {
                  // Ocultar pendentes não confirmados da lista principal financeira
                  if (app.payment_status === 'pendente' && app.status === 'solicitado') return null;
                  
                  return (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(app.appointment_date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4 font-medium">{app.profiles?.full_name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 text-indigo-600 font-semibold">{app.pets?.name || '-'}</td>
                      <td className="px-6 py-4 capitalize">{app.service_type}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">R$ {Number(app.price).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 uppercase text-[10px] tracking-wider text-gray-600 font-bold">
                        {app.payment_method ? app.payment_method.replace('_', ' ') : 'NÃO INFORMADO'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${app.payment_status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {app.payment_status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filteredFinancials.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Nenhuma transação financeira encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
