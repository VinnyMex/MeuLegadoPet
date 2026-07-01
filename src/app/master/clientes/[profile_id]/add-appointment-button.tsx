'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Textarea } from '@/components/ui/textarea'

export function AddAppointmentButton({ client }: { client: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const dateStr = formData.get('date') as string
    const timeStr = formData.get('time') as string
    
    const appointmentDate = new Date(`${dateStr}T${timeStr}:00`).toISOString()

    const appointmentData = {
      profile_id: client.id,
      pet_id: formData.get('pet_id') || null,
      service_type: formData.get('service_type'),
      appointment_date: appointmentDate,
      status: formData.get('status'),
      notes: formData.get('notes') || null,
      price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
      payment_status: formData.get('payment_status') || 'pendente'
    }

    try {
      const { error } = await supabase.from('appointments').insert(appointmentData)
      if (error) throw error
      
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      alert('Erro ao criar registro: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="h-8 rounded-full px-3 text-xs flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Adicionar Movimentação
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>Adicione um agendamento futuro ou um serviço realizado agora.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet_id">Pet</Label>
                <select id="pet_id" name="pet_id" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">Selecione o pet (Opcional)</option>
                  {client.pets?.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service_type">Serviço/Venda *</Label>
                <Input id="service_type" name="service_type" required placeholder="Ex: Banho, Tosa, Ração..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input id="time" name="time" type="time" required defaultValue={new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Valor (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" placeholder="Ex: 50.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">Pagamento</Label>
                <select id="payment_status" name="payment_status" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="agendado">Agendado</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" name="notes" placeholder="Detalhes do serviço ou venda..." rows={2} />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Movimentação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
