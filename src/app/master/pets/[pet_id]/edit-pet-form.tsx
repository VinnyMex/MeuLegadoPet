'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { masterUpdatePet } from './actions'

export function EditPetForm({ pet }: { pet: any }) {
  const [status, setStatus] = useState(pet.status || 'vivo')

  return (
    <form action={masterUpdatePet.bind(null, pet.id, pet.owner_id)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Pet</Label>
          <Input id="name" name="name" defaultValue={pet.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">Espécie</Label>
          <select 
            id="species" 
            name="species" 
            defaultValue={pet.species} 
            required
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="Cão">Cão</option>
            <option value="Gato">Gato</option>
            <option value="Pássaro">Pássaro</option>
            <option value="Roedor">Roedor</option>
            <option value="Outro">Outro</option>
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
          <Label htmlFor="weight_kg">Peso (kg)</Label>
          <Input id="weight_kg" name="weight_kg" type="number" step="0.1" defaultValue={pet.weight_kg || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select 
            id="status" 
            name="status" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="vivo">Vivo</option>
            <option value="falecido">Falecido</option>
          </select>
        </div>
        {status === 'falecido' && (
          <div className="space-y-2">
            <Label htmlFor="deceased_date">Data de Falecimento (se aplicável)</Label>
            <Input id="deceased_date" name="deceased_date" type="date" defaultValue={pet.deceased_date || ''} />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        Salvar Alterações
      </Button>
    </form>
  )
}
