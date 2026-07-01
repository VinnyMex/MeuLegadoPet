'use client'

import { useState } from 'react'
import { Plus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { requestAppointment } from './actions'
import { motion, AnimatePresence } from 'framer-motion'

export function RequestAppointmentClient({ pets }: { pets: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    try {
      await requestAppointment(formData)
      setNotification({ message: 'Sua solicitação de agendamento foi enviada. Aguarde a confirmação.', type: 'success' })
      setIsOpen(false)
    } catch (err: any) {
      setNotification({ message: err.message || 'Ocorreu um erro ao solicitar agendamento.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-lg text-sm font-medium border border-amber-200">
        Você precisa cadastrar um pet antes de solicitar um agendamento.
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Agenda</h1>
          <p className="text-gray-500">Acompanhe seus agendamentos de banho, tosa e vacinas.</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Solicitar Agendamento
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-semibold mb-2">Solicitar Agendamento</h3>
              <p className="text-gray-500 mb-6 text-sm">Escolha o pet, o serviço e o melhor horário. Entraremos em contato para confirmar.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="pet_id">Pet</Label>
                  <select 
                    id="pet_id" 
                    name="pet_id" 
                    title="Pet"
                    required
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione o pet...</option>
                    {pets.filter(pet => pet.status !== 'falecido').map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_type">Serviço</Label>
                  <select 
                    id="service_type" 
                    name="service_type" 
                    title="Serviço"
                    required
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione o serviço...</option>
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
                    <Label htmlFor="date">Data de Preferência</Label>
                    <Input id="date" name="date" type="date" required min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (Opcional)</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    placeholder="Alguma recomendação especial? Ex: Levar no pet shop, usar shampoo específico..." 
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-medium mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Enviando...' : 'Solicitar Horário'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={!!notification} onOpenChange={(open) => !open && setNotification(null)}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-6 text-center shadow-xl border-0 z-[60]">
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
