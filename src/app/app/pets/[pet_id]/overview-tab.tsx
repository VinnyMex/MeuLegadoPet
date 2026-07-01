import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function OverviewTab({ pet }: { pet: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div className="space-y-1.5">
            <CardTitle>Informações Principais</CardTitle>
            <CardDescription>Detalhes básicos do seu pet.</CardDescription>
          </div>
          <Link href={`/app/pets/${pet.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" /> Editar Pet
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Espécie / Raça</dt>
              <dd className="mt-1 text-sm text-gray-900">{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nascimento / Idade</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {pet.birth_date ? format(new Date(pet.birth_date), "dd/MM/yyyy") : 'Desconhecido'} 
                {pet.estimated_age_years ? ` (Aprox. ${pet.estimated_age_years} anos)` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sexo / Castrado</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {pet.sex === 'M' ? 'Macho' : pet.sex === 'F' ? 'Fêmea' : 'Não informado'}
                {pet.neutered ? ' (Castrado)' : ' (Não castrado)'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Porte / Peso</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {pet.size || 'Não informado'} 
                {pet.weight_kg ? ` - ${pet.weight_kg} kg` : ''}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
