import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AgendaListClient } from './agenda/agenda-list-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user?.id)

  const { data: admin } = await supabase.from('profiles').select('phone').eq('role', 'admin').limit(1).single()
  const companyPhone = admin?.phone ? admin.phone.replace(/\D/g, '') : '5511999999999'

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, pets(name, avatar_url)')
    .eq('profile_id', user?.id)
    .order('appointment_date', { ascending: true })

  return (
    <div className="space-y-12">
      {/* SEÇÃO MEUS PETS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meus Pets</h1>
            <p className="text-gray-500">Acompanhe a história e os cuidados dos seus melhores amigos.</p>
          </div>
          <Link href="/app/pets/new">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pet
            </Button>
          </Link>
        </div>

        {(!pets || pets.length === 0) ? (
          <Card className="border-dashed bg-gray-50 text-center py-12">
            <CardContent className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-full bg-amber-100 p-3">
                <Plus className="h-6 w-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-medium">Nenhum pet cadastrado</p>
                <p className="text-sm text-gray-500">Comece adicionando seu primeiro companheiro.</p>
              </div>
              <Link href="/app/pets/new" className="mt-4">
                <Button variant="outline">Cadastrar Agora</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => {
              const isDeceased = pet.status === 'falecido'
              return (
                <Link key={pet.id} href={`/app/pets/${pet.id}`}>
                  <Card className={`hover:shadow-md transition-shadow cursor-pointer h-full border-gray-200 ${isDeceased ? 'opacity-60 grayscale' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {pet.avatar_url ? (
                            <img src={pet.avatar_url} alt={pet.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-amber-100 flex items-center justify-center text-amber-800 text-xl font-bold">
                              {pet.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl">{pet.name}</CardTitle>
                            {isDeceased && <span className="text-[10px] uppercase font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Falecido</span>}
                          </div>
                          <CardDescription className="capitalize">{pet.species} • {pet.breed || 'Sem raça definida'}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        Nascido em {pet.birth_date ? new Date(pet.birth_date).toLocaleDateString('pt-BR') : 'Data desconhecida'}.
                        {isDeceased && pet.deceased_date && ` Falecido em ${new Date(pet.deceased_date).toLocaleDateString('pt-BR')}.`}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO AGENDA */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <AgendaListClient appointments={appointments || []} pets={pets || []} companyPhone={companyPhone} />
      </div>
    </div>
  )
}
