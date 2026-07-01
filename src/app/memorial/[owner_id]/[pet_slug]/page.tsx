import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TributeForm } from './memorial-client'

export async function generateMetadata(props: { params: Promise<{ owner_id: string, pet_slug: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data } = await supabase.from('memorials').select('title, pets!inner(name, avatar_url, owner_id)').eq('slug', params.pet_slug).eq('pets.owner_id', params.owner_id).single()
  
  if (!data) return { title: 'Memorial não encontrado' }
  
  return {
    title: `${data.title} | Meu Legado Pet`,
    description: `Memorial digital de ${(data.pets as any)?.name}`,
    openGraph: {
      images: [(data.pets as any)?.avatar_url || ''],
    }
  }
}

export default async function MemorialPage(props: { params: Promise<{ owner_id: string, pet_slug: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  // Buscar Memorial verificando owner_id
  const { data: memorial } = await supabase
    .from('memorials')
    .select('*, pets!inner(*)')
    .eq('slug', params.pet_slug)
    .eq('pets.owner_id', params.owner_id)
    .single()

  if (!memorial || !memorial.active || memorial.visibility === 'private') {
    notFound()
  }

  const pet = memorial.pets as any

  // Buscar Tributes aprovados
  const { data: tributes } = await supabase
    .from('tributes')
    .select('*, media_files(storage_path)')
    .eq('memorial_id', memorial.id)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-black selection:text-white pb-20">
      
      {/* Hero Header Apple Style */}
      <div className="w-full flex flex-col items-center justify-center pt-32 pb-16 px-6">
        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl mb-10 border-[6px] border-white ring-1 ring-gray-100">
          {pet.avatar_url ? (
            <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-6xl font-medium text-gray-300">
              {pet.name.charAt(0)}
            </div>
          )}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-center max-w-3xl">
          {pet.name}
        </h1>
        <p className="mt-6 text-xl md:text-3xl font-medium text-[#86868B] text-center max-w-2xl tracking-tight leading-snug">
          {memorial.title}
        </p>
      </div>

      {/* Main Message */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xl md:text-2xl text-center leading-relaxed font-medium text-gray-800">
          {memorial.main_message}
        </p>
      </div>

      {/* Gallery */}
      {memorial.gallery_urls && memorial.gallery_urls.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memorial.gallery_urls.map((url: string, i: number) => (
              <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                <img src={url} alt={`Memorial foto ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tributes Grid */}
      {tributes && tributes.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16">Homenagens da Família e Amigos</h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {tributes.map((tribute) => (
              <div key={tribute.id} className="break-inside-avoid bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/50 transition-all hover:shadow-xl">
                <h3 className="font-semibold text-lg mb-1">{tribute.guest_name}</h3>
                <span className="block text-xs text-gray-400 mb-4">
                  {new Date(tribute.created_at).toLocaleDateString('pt-BR')}
                </span>
                {tribute.message && (
                  <p className="text-gray-500 leading-relaxed">{tribute.message}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Area */}
      <TributeForm memorialId={memorial.id} />

      <footer className="mt-20 text-center text-sm font-medium text-gray-400">
        <p>Um legado eterno guardado no <span className="text-gray-900">Meu Legado Pet</span></p>
      </footer>
    </div>
  )
}
