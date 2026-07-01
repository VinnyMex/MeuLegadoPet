'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateMemorial } from './actions-memorial'
import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function MemorialTab({ petId, memorial, ownerId }: { petId: string, memorial: any, ownerId: string }) {
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSaving(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      const files = formData.getAll('gallery_files') as File[]
      
      // Upload novos arquivos (limitado a 3)
      const validFiles = files.filter(f => f.size > 0).slice(0, 3)
      const uploadedUrls: string[] = memorial?.gallery_urls ? [...memorial.gallery_urls] : []
      
      for (const file of validFiles) {
        if (uploadedUrls.length >= 3) break;
        
        const fileExt = file.name.split('.').pop()
        const fileName = `memorial_${petId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `memorials/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file)

        if (!uploadError) {
          const { data } = supabase.storage.from('media').getPublicUrl(filePath)
          uploadedUrls.push(data.publicUrl)
        }
      }

      if (uploadedUrls.length > 0) {
        formData.append('gallery_urls', JSON.stringify(uploadedUrls))
      }

      await updateMemorial(petId, formData)
      alert('Configurações salvas com sucesso!')
    } catch (e) {
      alert('Erro ao salvar memorial.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-indigo-100">
      <CardHeader className="bg-indigo-50/50 rounded-t-xl pb-6 border-b border-indigo-100">
        <CardTitle className="text-xl text-indigo-900">Memorial Digital</CardTitle>
        <CardDescription className="text-indigo-700/80">Configure a página pública de homenagem eterna para o seu pet.</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
            <input type="checkbox" id="active" name="active" title="Ativar Memorial Público" defaultChecked={memorial?.active} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
            <div className="flex-1">
              <Label htmlFor="active" className="text-base font-medium cursor-pointer">Ativar Memorial Público</Label>
              <p className="text-sm text-gray-500">Torna o memorial acessível através da URL pública configurada abaixo.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Endereço da Página (URL)</Label>
            <div className="flex items-center">
              <span className="bg-gray-100 border border-r-0 rounded-l-md px-3 py-2 text-sm text-gray-500 font-mono">meulegadopet.com/memorial/</span>
              <Input id="slug" name="slug" className="rounded-l-none font-mono" defaultValue={memorial?.slug || ''} placeholder="nome-do-pet" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título Principal</Label>
            <Input id="title" name="title" defaultValue={memorial?.title || ''} placeholder="Ex: Para sempre em nossos corações..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainMessage">Mensagem de Homenagem</Label>
            <Textarea id="mainMessage" name="mainMessage" rows={5} defaultValue={memorial?.main_message || ''} placeholder="Escreva a mensagem central do memorial..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidade</Label>
            <select id="visibility" name="visibility" title="Visibilidade" defaultValue={memorial?.visibility || 'public'} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="public">Público (Listado em buscas e acessível a todos)</option>
              <option value="link">Apenas com o Link</option>
              <option value="private">Privado (Apenas você pode ver)</option>
            </select>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Fotos para o Memorial (Máximo 3)</Label>
            <p className="text-sm text-gray-500 mb-2">Adicione lindas recordações do seu pet para a galeria pública.</p>
            <Input type="file" name="gallery_files" multiple accept="image/*" />
            {memorial?.gallery_urls && memorial.gallery_urls.length > 0 && (
              <div className="flex gap-2 mt-4">
                {memorial.gallery_urls.map((url: string, i: number) => (
                  <div key={i} className="relative w-16 h-16 rounded overflow-hidden border">
                    <img src={url} alt={`Memorial foto ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 rounded-b-xl border-t py-4 flex justify-between items-center">
          {memorial?.slug && memorial?.active ? (
            <Link href={`/memorial/${ownerId}/${memorial.slug}`} target="_blank" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="h-4 w-4" /> Visualizar Memorial
            </Link>
          ) : (
            <div />
          )}
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Salvar Configurações
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
