'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { PlusCircle, Image as ImageIcon, Video, Calendar, MoreHorizontal } from 'lucide-react'
import { masterAddTimelineEntry } from './actions-forms'

export function TimelineTab({ petId, entries }: { petId: string, entries: any[] }) {
  return (
    <div className="space-y-6">
      
      <Card className="border-indigo-100 shadow-sm">
        <CardHeader className="bg-indigo-50/50 rounded-t-xl pb-4 border-b border-indigo-100">
          <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
            <PlusCircle className="h-5 w-5 text-indigo-600" />
            Adicionar Novo Momento
          </CardTitle>
          <CardDescription>Registre fotos, vídeos ou anotações importantes na linha do tempo deste pet.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form action={masterAddTimelineEntry.bind(null, petId)} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Título do Momento</Label>
                <Input id="title" name="title" required placeholder="Ex: Primeiro Banho" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-sm font-medium">Data do Evento</Label>
                <Input id="eventDate" name="eventDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">Descrição / Anotações</Label>
              <Textarea id="content" name="content" placeholder="Descreva como foi..." className="resize-none h-20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">Anexar Foto ou Vídeo (Opcional)</Label>
              <Input id="file" name="file" type="file" accept="image/*,video/*" className="cursor-pointer" />
            </div>

            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto self-start mt-2">
              Salvar na Linha do Tempo
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Histórico Registrado</h3>
        {entries.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed rounded-xl text-gray-500 bg-gray-50">
            Nenhum registro na linha do tempo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((e: any) => {
              let icon = <MoreHorizontal className="h-4 w-4" />
              if (e.entry_type === 'photo') icon = <ImageIcon className="h-4 w-4 text-pink-500" />
              if (e.entry_type === 'video') icon = <Video className="h-4 w-4 text-purple-500" />

              return (
                <Card key={e.id} className="overflow-hidden hover:shadow-md transition-all">
                  {e.media_files && (
                    <div className="w-full h-40 bg-gray-100 relative">
                      {e.entry_type === 'video' ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                           <Video className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      ) : null}
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media_files/${e.media_files.storage_path}`} 
                        alt="Mídia do evento" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {icon}
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                        {format(new Date(e.event_date || e.created_at), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{e.title}</h4>
                    {e.content && (
                      <p className="text-sm text-gray-600 line-clamp-2">{e.content}</p>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
