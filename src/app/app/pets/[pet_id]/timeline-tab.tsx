'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addTimelineEntry } from './actions'
import { Loader2, Image as ImageIcon, Video, Calendar, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TimelineTab({ petId, entries }: { petId: string, entries: any[] }) {
  const [isUploading, setIsUploading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setIsUploading(true)
    try {
      await addTimelineEntry(petId, formData)
      formRef.current?.reset()
    } catch (err) {
      console.error(err)
      alert('Erro ao criar registro.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Formulário de Nova Entrada */}
      <Card className="bg-amber-50/50 border-amber-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Novo Momento</CardTitle>
          <CardDescription>O que você quer guardar sobre o seu pet hoje?</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input name="title" placeholder="Título (ex: Primeiro banho no mar!)" required />
            </div>
            <div className="space-y-2">
              <Textarea name="content" placeholder="Escreva os detalhes desse momento especial..." rows={3} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="eventDate" className="text-xs text-gray-500">Data do Evento</Label>
                  <Input id="eventDate" name="eventDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="file" className="text-xs text-gray-500">Foto ou Vídeo</Label>
                  <Input id="file" name="file" type="file" accept="image/*,video/*" />
                </div>
              </div>
              <Button type="submit" disabled={isUploading} className="w-full sm:w-auto mt-2 sm:mt-0">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isUploading ? 'Salvando...' : 'Salvar Momento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed da Linha do Tempo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-600" /> Histórico
        </h3>
        
        {entries.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-lg text-gray-500">
            A linha do tempo está vazia. Registre o primeiro momento especial acima!
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            {entries.map((entry) => (
              <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Ícone central */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-amber-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {entry.entry_type === 'photo' ? <ImageIcon className="h-4 w-4" /> : entry.entry_type === 'video' ? <Video className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
                </div>
                
                {/* Card do evento */}
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow">
                  {entry.media_files && (
                    <div className="w-full h-48 bg-gray-100 rounded-t-xl overflow-hidden relative">
                      {/* O StorageURL precisa apontar pro bucket correto */}
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media_files/${entry.media_files.storage_path}`} 
                        alt="Mídia da Timeline" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className={entry.media_files ? "pt-4" : ""}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        {format(new Date(entry.event_date), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </CardHeader>
                  {entry.content && (
                    <CardContent>
                      <p className="text-gray-600 whitespace-pre-wrap">{entry.content}</p>
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
