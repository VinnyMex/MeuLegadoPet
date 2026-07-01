'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function EditPetPage({ params }: { params: Promise<{ pet_id: string }> }) {
  const unwrappedParams = use(params)
  const petId = unwrappedParams.pet_id
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pet, setPet] = useState<any>(null)

  useEffect(() => {
    async function loadPet() {
      const supabase = createClient()
      const { data, error } = await supabase.from('pets').select('*').eq('id', petId).single()
      if (error) {
        setError('Erro ao carregar pet.')
      } else {
        setPet(data)
      }
      setIsLoading(false)
    }
    loadPet()
  }, [petId])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const petData = {
      name: formData.get('name') as string,
      species: formData.get('species') as string,
      breed: formData.get('breed') as string,
      birth_date: formData.get('birth_date') as string || null,
      size: formData.get('size') as string,
      weight_kg: formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null,
      sex: formData.get('sex') as string,
    }

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('pets')
      .update(petData)
      .eq('id', petId)
      
    if (updateError) {
      console.error(updateError)
      setError("Erro ao atualizar pet. Tente novamente.")
      setIsSaving(false)
      return
    }

    router.push(`/app/pets/${petId}`)
    router.refresh()
  }

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
  if (!pet) return <div className="p-8 text-center text-red-500">Pet não encontrado.</div>

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Editar Informações do Pet</CardTitle>
          <CardDescription>
            Atualize os dados básicos do {pet.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="edit-pet-form" onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet</Label>
                <Input id="name" name="name" required defaultValue={pet.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Espécie</Label>
                <select 
                  id="species" 
                  name="species" 
                  title="Espécie"
                  required
                  defaultValue={pet.species}
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="cão">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="pássaro">Pássaro</option>
                  <option value="roedor">Roedor</option>
                  <option value="réptil">Réptil</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Raça</Label>
                <Input id="breed" name="breed" defaultValue={pet.breed || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento (aproximada)</Label>
                <Input id="birth_date" name="birth_date" type="date" defaultValue={pet.birth_date || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Porte</Label>
                <select 
                  id="size" 
                  name="size" 
                  title="Porte" 
                  defaultValue={pet.size || 'pequeno'}
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="pequeno">Pequeno</option>
                  <option value="médio">Médio</option>
                  <option value="grande">Grande</option>
                  <option value="gigante">Gigante</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <select 
                  id="sex" 
                  name="sex" 
                  title="Sexo" 
                  defaultValue={pet.sex || 'macho'}
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="macho">Macho</option>
                  <option value="fêmea">Fêmea</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Peso (kg)</Label>
                <Input id="weight_kg" name="weight_kg" type="number" step="0.1" defaultValue={pet.weight_kg || ''} />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-pet-form" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isSaving ? 'Salvando...' : 'Atualizar Pet'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
