'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Loader2, Calendar, User, Dog, MessageCircle } from 'lucide-react'
import { updateAppointmentStatus } from './dashboard-actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export function AppointmentsList({ appointments }: { appointments: any[] }) {
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleStatusChange(newStatus: string) {
    if (!selectedApp) return
    setIsUpdating(true)
    try {
      await updateAppointmentStatus(selectedApp.id, newStatus)
      // Optimistic update locally for immediate feedback (or rely on server revalidation)
      setSelectedApp(null)
    } catch (err: any) {
      alert('Erro ao atualizar agendamento: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  function getWhatsAppMessage(app: any) {
    const date = new Date(app.appointment_date).toLocaleDateString('pt-BR')
    const time = new Date(app.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    const price = app.price ? `R$ ${Number(app.price).toFixed(2).replace('.', ',')}` : 'A definir'
    const payment = app.payment_status === 'pago' ? 'Já pago' : 'Pagamento pendente'
    const service = app.service_type
    const petName = app.pets?.name || 'seu pet'
    const clientName = app.profiles?.full_name ? app.profiles.full_name.split(' ')[0] : 'Cliente'
    return encodeURIComponent(`Olá ${clientName}! Tudo bem?\nPassando para confirmar o agendamento do(a) ${petName}.\n\n🗓 Data: ${date} às ${time}\n✂ Serviço: ${service}\n💰 Valor: ${price} (${payment})\n\nNos vemos em breve!`)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 10).map(app => (
                <div key={app.id} className="flex items-center justify-between border-b pb-3 group">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize text-sm">{app.service_type}</p>
                    <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                      <span className="flex items-center gap-1"><User className="w-3 h-3"/> {app.profiles?.full_name || 'Desconhecido'}</span>
                      <span className="flex items-center gap-1">
                        {app.pets?.avatar_url ? (
                          <img src={app.pets.avatar_url} className="w-3.5 h-3.5 rounded-full object-cover" alt="" />
                        ) : (
                          <Dog className="w-3 h-3"/> 
                        )}
                        {app.pets?.name || 'Desconhecido'}
                      </span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(app.appointment_date).toLocaleDateString('pt-BR')} às {new Date(app.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <span className={`text-[10px] px-2 py-1 uppercase font-bold rounded-full ${app.status === 'agendado' ? 'bg-sky-100 text-sky-800' : app.status === 'solicitado' ? 'bg-orange-100 text-orange-800' : app.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {app.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedApp(app)}>
                        <Edit2 className="w-3 h-3 mr-1" /> Editar
                      </Button>
                      
                      {app.status === 'agendado' && app.profiles?.phone && (
                        <a 
                          href={`https://wa.me/55${app.profiles.phone.replace(/\D/g, '')}?text=${getWhatsAppMessage(app)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 text-xs flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" /> Confirmar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum agendamento futuro.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visualização Rápida de Agendamento</DialogTitle>
            <DialogDescription>Confirme, remarque ou cancele o agendamento abaixo.</DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4 my-4">
              <div className="p-4 bg-gray-50 rounded-lg border text-sm space-y-2">
                <p><strong>Serviço:</strong> <span className="capitalize">{selectedApp.service_type}</span></p>
                <p><strong>Data/Hora:</strong> {new Date(selectedApp.appointment_date).toLocaleString('pt-BR')}</p>
                <p><strong>Cliente:</strong> {selectedApp.profiles?.full_name}</p>
                <div className="flex items-center gap-1">
                  <strong>Pet:</strong> 
                  {selectedApp.pets?.avatar_url && (
                    <img src={selectedApp.pets.avatar_url} className="w-4 h-4 rounded-full object-cover ml-1" alt="" />
                  )}
                  {selectedApp.pets?.name}
                </div>
                <p><strong>Status Atual:</strong> <span className="uppercase text-xs font-bold bg-gray-200 px-2 py-0.5 rounded ml-1">{selectedApp.status}</span></p>
                {selectedApp.notes && (
                  <div className="mt-2 pt-2 border-t text-gray-600">
                    <p className="font-semibold text-xs text-gray-900 mb-1">Observações do Cliente:</p>
                    <p className="italic">"{selectedApp.notes}"</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <Button disabled={isUpdating} onClick={() => handleStatusChange('agendado')} className="bg-sky-600 hover:bg-sky-700 text-white">
                  Confirmar / Agendado
                </Button>
                <Button disabled={isUpdating} onClick={() => handleStatusChange('concluido')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Marcar Concluído
                </Button>
                <Button disabled={isUpdating} variant="destructive" onClick={() => handleStatusChange('cancelado')}>
                  Cancelar Agendamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
