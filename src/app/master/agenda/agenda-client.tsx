'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Calendar as CalendarIcon, Upload, CheckCircle2 } from 'lucide-react'
import { format, isSameDay, addDays, subDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AgendaClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAllDates, setShowAllDates] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)

  const filteredAppointments = useMemo(() => {
    const today = new Date()
    const fiveDaysAgo = subDays(today, 5)
    const fifteenDaysAhead = addDays(today, 15)

    return initialAppointments.filter(app => {
      // Search Filter
      const searchLower = searchTerm.toLowerCase()
      const clientName = (app.profiles?.full_name || '').toLowerCase()
      const petName = (app.pets?.name || '').toLowerCase()
      const service = (app.service_type || '').toLowerCase()
      
      const matchesSearch = clientName.includes(searchLower) || petName.includes(searchLower) || service.includes(searchLower)

      // Date Filter
      const appDate = new Date(app.appointment_date)
      const matchesDate = showAllDates || (appDate >= fiveDaysAgo && appDate <= fifteenDaysAhead)

      return matchesSearch && matchesDate
    })
  }, [initialAppointments, searchTerm, showAllDates])

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Agenda Global</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar cliente, pet ou serviço..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowAllDates(!showAllDates)}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            {showAllDates ? 'Filtrar Próximos Dias' : 'Mostrar Todas as Datas'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Operacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Data/Hora (BRT)</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Pet</th>
                  <th className="px-6 py-3">Serviço</th>
                  <th className="px-6 py-3">Preço</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Pagamento</th>
                  <th className="px-6 py-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app: any) => {
                  const isToday = isSameDay(new Date(app.appointment_date), new Date())
                  return (
                    <tr key={app.id} className={`border-b hover:bg-gray-50 ${isToday ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                        {isToday && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" title="Hoje"></span>}
                        {format(new Date(app.appointment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4">{app.profiles?.full_name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">{app.pets?.name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 capitalize">{app.service_type}</td>
                      <td className="px-6 py-4">R$ {app.price ? Number(app.price).toFixed(2).replace('.', ',') : '0,00'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${app.status === 'solicitado' ? 'bg-orange-100 text-orange-800' : app.status === 'agendado' ? 'bg-sky-100 text-sky-800' : app.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${app.payment_status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {app.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="text-indigo-600" onClick={() => setSelectedApp(app)}>
                          Gerenciar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Nenhum agendamento encontrado para estes filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL / SLIDEOVER PARA GERENCIAMENTO */}
      {selectedApp && (
        <ManageAppointmentModal 
          appointment={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          onSaved={() => {
            setSelectedApp(null)
            window.location.reload() // Quick reload for test app
          }} 
        />
      )}
    </div>
  )
}

function ManageAppointmentModal({ appointment, onClose, onSaved }: { appointment: any, onClose: () => void, onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState(appointment.status)
  const [paymentStatus, setPaymentStatus] = useState(appointment.payment_status)
  const [paymentMethod, setPaymentMethod] = useState(appointment.payment_method || 'nenhuma')
  const [files, setFiles] = useState<FileList | null>(null)

  async function handleSave() {
    setIsSaving(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // 1. Update appointment
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod === 'nenhuma' ? null : paymentMethod
      })
      .eq('id', appointment.id)

    if (updateError) {
      console.error(updateError)
      alert("Erro ao salvar o atendimento")
      setIsSaving(false)
      return
    }

    // 2. Upload images if any
    if (files && files.length > 0) {
      const maxFiles = Math.min(files.length, 3)
      for (let i = 0; i < maxFiles; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${appointment.id}_${Date.now()}_${i}.${fileExt}`
        const filePath = `appointments/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file)

        if (!uploadError) {
          // Insert into appointment_images
          await supabase.from('appointment_images').insert({
            appointment_id: appointment.id,
            storage_path: filePath
          })
        }
      }
    }

    setIsSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Gerenciar Atendimento</h2>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold">{appointment.pets?.name} - {appointment.service_type}</p>
            <p className="text-xs text-gray-500">{format(new Date(appointment.appointment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            <p className="text-xs text-gray-500 mt-1">Tutor: {appointment.profiles?.full_name}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Status Operacional</label>
            <select 
              className="w-full mt-1 p-2 border rounded-md text-sm" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="solicitado">Solicitado (Pendente Confirmação)</option>
              <option value="agendado">Agendado (Confirmado)</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Status Financeiro</label>
            <select 
              className="w-full mt-1 p-2 border rounded-md text-sm" 
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Forma de Pagamento</label>
            <select 
              className="w-full mt-1 p-2 border rounded-md text-sm" 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="nenhuma">Não informada</option>
              <option value="pix">PIX</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
              <option value="dinheiro">Dinheiro</option>
            </select>
          </div>

          <div className="border-t pt-4 mt-4">
            <label className="text-sm font-medium flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4" /> Anexar Fotos (Antes/Depois)
            </label>
            <p className="text-xs text-orange-600 mb-3 bg-orange-50 p-2 rounded border border-orange-100">
              ⚠️ Fotos anexadas expiram e são deletadas automaticamente em 15 dias para economizar espaço no banco de dados.
            </p>
            <Input 
              type="file" 
              multiple 
              accept="image/*" 
              className="text-sm" 
              onChange={(e) => setFiles(e.target.files)}
            />
            <p className="text-[10px] text-gray-500 mt-1">Máximo 3 arquivos. {files?.length ? `${files.length} selecionados.` : ''}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
