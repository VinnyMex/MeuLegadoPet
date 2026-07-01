'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function NewPetPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
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
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError("Você precisa estar logado.")
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('pets')
      .insert({ ...petData, owner_id: user.id })
      
    if (insertError) {
      console.error(insertError)
      setError("Erro ao cadastrar pet. Tente novamente.")
      setIsLoading(false)
      return
    }

    router.push('/app')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrar Novo Pet</CardTitle>
          <CardDescription>
            Preencha os dados básicos do seu novo companheiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="pet-form" onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet</Label>
                <Input id="name" name="name" required placeholder="Ex: Rex, Luna..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Espécie</Label>
                <select 
                  id="species" 
                  name="species" 
                  title="Espécie"
                  required
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                <Input id="breed" name="breed" placeholder="Ex: Golden Retriever" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Data de Nascimento (aproximada)</Label>
                <Input id="birth_date" name="birth_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Porte</Label>
                <select 
                  id="size" 
                  name="size" 
                  title="Porte" 
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="macho">Macho</option>
                  <option value="fêmea">Fêmea</option>
                </select>
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" form="pet-form" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
            {isLoading ? 'Salvando...' : 'Salvar Pet'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
