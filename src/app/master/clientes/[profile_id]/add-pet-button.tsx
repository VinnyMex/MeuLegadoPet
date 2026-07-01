'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AddPetButton({ ownerId }: { ownerId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const petData = {
      owner_id: ownerId,
      name: formData.get('name'),
      species: formData.get('species'),
      breed: formData.get('breed') || null,
      sex: formData.get('sex') || null,
      birth_date: formData.get('birth_date') || null,
      weight_kg: formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null,
    }

    try {
      const { error } = await supabase.from('pets').insert(petData)
      if (error) throw error
      
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      alert('Erro ao criar pet: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="h-8 rounded-full px-3 text-xs flex items-center gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Adicionar Pet
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Pet</DialogTitle>
            <DialogDescription>Cadastre um novo pet para este cliente.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pet *</Label>
              <Input id="name" name="name" required placeholder="Ex: Rex" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Espécie *</Label>
                <select id="species" name="species" required className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="cão">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Raça</Label>
                <Input id="breed" name="breed" placeholder="Ex: SRD" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <select id="sex" name="sex" className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="">Selecione</option>
                  <option value="M">Macho</option>
                  <option value="F">Fêmea</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Nascimento</Label>
                <Input id="birth_date" name="birth_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Peso (kg)</Label>
                <Input id="weight_kg" name="weight_kg" type="number" step="0.1" placeholder="Ex: 5.5" />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Pet
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
