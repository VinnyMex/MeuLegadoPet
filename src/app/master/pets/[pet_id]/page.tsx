import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Dog } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditPetForm } from './edit-pet-form'
import { HealthTab } from './health-tab'
import { TimelineTab } from './timeline-tab'

export const dynamic = 'force-dynamic'

export default async function MasterEditPet(props: { params: Promise<{ pet_id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // 1. Fetch Pet Data
  const { data: pet } = await supabase
    .from('pets')
    .select('*, profiles(full_name)')
    .eq('id', params.pet_id)
    .single()

  if (!pet) {
    notFound()
  }

  // 2. Fetch Health Data
  const { data: healthRecord } = await supabase
    .from('pet_health')
    .select('*')
    .eq('pet_id', pet.id)
    .single()

  // 3. Fetch Timeline Entries
  const { data: timelineEntries } = await supabase
    .from('timeline_entries')
    .select('*, media_files(storage_path)')
    .eq('pet_id', pet.id)
    .order('event_date', { ascending: false })

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href={`/master/clientes/${pet.owner_id}`} className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o Cliente
        </Link>
        <div className="flex items-center gap-4">
          {pet.avatar_url ? (
            <img src={pet.avatar_url} alt={pet.name} className="w-16 h-16 rounded-full border-2 border-indigo-100 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              <Dog className="w-8 h-8" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pet: {pet.name}</h1>
            <p className="text-gray-500">Tutor: {(pet.profiles as any)?.full_name || 'Desconhecido'}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto overflow-y-hidden whitespace-nowrap [&::-webkit-scrollbar]:hidden">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
          >
            Informações Gerais
          </TabsTrigger>
          <TabsTrigger 
            value="health" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
          >
            Saúde & CRM
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
          >
            Linha do Tempo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>Edite os dados básicos do pet.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditPetForm pet={pet} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="mt-0 outline-none">
          <HealthTab petId={pet.id} healthRecord={healthRecord} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-0 outline-none">
          <TimelineTab petId={pet.id} entries={timelineEntries || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
