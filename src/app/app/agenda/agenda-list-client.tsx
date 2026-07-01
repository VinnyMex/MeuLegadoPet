'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar, Edit, MessageCircle, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateClientAppointment, cancelClientAppointment } from './actions'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { format } from 'date-fns'

export function AgendaListClient({ 
  appointments, 
  pets,
  companyPhone
}: { 
  appointments: any[],
  pets: any[],
  companyPhone: string
}) {
  const [editingApp, setEditingApp] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateClientAppointment(editingApp.id, formData)
      setNotification({ message: 'Solicitação atualizada com sucesso!', type: 'success' })
      setEditingApp(null)
    } catch (err: any) {
      setNotification({ message: err.message || 'Erro ao atualizar solicitação.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancel(appId: string) {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) return
    setIsSubmitting(true)
    try {
      await cancelClientAppointment(appId)
      setNotification({ message: 'Solicitação cancelada com sucesso.', type: 'success' })
      setEditingApp(null)
    } catch (err: any) {
      setNotification({ message: err.message || 'Erro ao cancelar solicitação.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function getWhatsAppUrl(app: any) {
    const message = encodeURIComponent(`Olá! Sou cliente e gostaria de falar sobre o meu agendamento.`)
    return `https://wa.me/${companyPhone}?text=${message}`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Meus Agendamentos
          </CardTitle>
          <CardDescription>Consulte os serviços agendados para os seus pets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments?.map((app: any) => (
              <div key={app.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 capitalize">{app.service_type}</span>
                    <span className="text-sm font-medium text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full flex items-center gap-1.5">
                      {app.pets?.avatar_url && <img src={app.pets.avatar_url} className="w-4 h-4 rounded-full object-cover" alt="" />}
                      {app.pets?.name || 'Pet Removido'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(app.appointment_date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} às {new Date(app.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  {app.notes && (
                    <div className="text-xs text-gray-400 mt-1 italic">"{app.notes}"</div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'agendado' ? 'bg-sky-100 text-sky-800' : app.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : app.status === 'solicitado' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                    {app.status}
                  </span>
                  
                  {app.status === 'solicitado' && (
                    <Button variant="outline" size="sm" onClick={() => setEditingApp(app)}>
                      <Edit className="w-4 h-4 mr-2" /> Editar Solicitação
                    </Button>
                  )}

                  {(app.status === 'agendado' || app.status === 'concluido') && (
                    <a 
                      href={getWhatsAppUrl(app)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Falar com a Loja
                    </a>
                  )}
                  
                  {app.price && (
                    <div className="text-sm font-medium border-l pl-3 hidden sm:block">
                      R$ {Number(app.price).toFixed(2).replace('.', ',')}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(!appointments || appointments.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Nenhum serviço agendado no momento.</p>
                <p className="text-sm mt-1">Solicite um horário acima.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingApp} onOpenChange={(open) => !open && setEditingApp(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Solicitação</DialogTitle>
            <DialogDescription>
              Você pode alterar os detalhes enquanto a loja não confirmar o agendamento.
            </DialogDescription>
          </DialogHeader>
          
          {editingApp && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pet_id">Pet</Label>
                <select 
                  id="pet_id" 
                  name="pet_id" 
                  defaultValue={editingApp.pet_id}
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Selecione o pet...</option>
                  {pets.filter(p => p.status !== 'falecido').map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_type">Serviço</Label>
                <select 
                  id="service_type" 
                  name="service_type" 
                  defaultValue={editingApp.service_type}
                  required
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="banho">Banho</option>
                  <option value="tosa">Tosa</option>
                  <option value="banho_tosa">Banho e Tosa</option>
                  <option value="vacina">Vacina</option>
                  <option value="consulta">Consulta</option>
                  <option value="exame">Exame</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    defaultValue={editingApp.appointment_date.split('T')[0]}
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input 
                    id="time" 
                    name="time" 
                    type="time" 
                    defaultValue={new Date(editingApp.appointment_date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  defaultValue={editingApp.notes || ''}
                  rows={2}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t mt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => handleCancel(editingApp.id)}
                  disabled={isSubmitting}
                >
                  Cancelar Solicitação
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingApp(null)} disabled={isSubmitting}>
                    Voltar
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!notification} onOpenChange={(open) => !open && setNotification(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-6 text-center shadow-xl border-0">
          <div className="py-4">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${notification?.type === 'error' ? 'bg-red-100' : 'bg-emerald-100'}`}>
              <span className={`text-2xl ${notification?.type === 'error' ? 'text-red-600' : 'text-emerald-600'}`}>
                {notification?.type === 'error' ? '!' : '✓'}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {notification?.type === 'error' ? 'Atenção' : 'Sucesso'}
            </h3>
            <p className="text-gray-600 mb-6">
              {notification?.message}
            </p>
            <Button onClick={() => setNotification(null)} className={`w-full ${notification?.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}>
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
