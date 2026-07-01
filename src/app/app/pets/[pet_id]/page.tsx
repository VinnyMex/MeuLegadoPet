import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PetAvatarClient } from './pet-avatar'
import { OverviewTab } from './overview-tab'
import { HistoryTab } from './history-tab'
import { MemorialTab } from './memorial-tab'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PetProfilePage(props: { params: Promise<{ pet_id: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch Pet Data
  const { data: pet, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', params.pet_id)
    .eq('owner_id', user.id)
    .single()

  if (error || !pet) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Pet não encontrado</h2>
        <p className="text-gray-500 mt-2">O pet que você está procurando não existe ou você não tem permissão para acessá-lo.</p>
        <Link href="/app" className="mt-6 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
        </Link>
      </div>
    )
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

  // 4. Fetch Memorial Settings
  const { data: memorial } = await supabase
    .from('memorials')
    .select('*')
    .eq('pet_id', pet.id)
    .single()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/app" className="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Meus Pets
        </Link>
      </div>

      {/* Header do Pet */}
      <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
        <PetAvatarClient petId={pet.id} currentUrl={pet.avatar_url} petName={pet.name} />
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{pet.name}</h1>
          <p className="text-lg text-gray-500 mt-1">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
        </div>
      </div>

      {/* Navegação de Abas */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full flex justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto overflow-y-hidden whitespace-nowrap [&::-webkit-scrollbar]:hidden">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Histórico Clínico
          </TabsTrigger>
          <TabsTrigger 
            value="memorial" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent px-4 py-3"
          >
            Memorial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none">
          <OverviewTab pet={pet} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0 outline-none">
          <HistoryTab petId={pet.id} healthRecord={healthRecord} entries={timelineEntries || []} />
        </TabsContent>
        
        <TabsContent value="memorial" className="mt-0 outline-none">
          <MemorialTab petId={pet.id} memorial={memorial} ownerId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
