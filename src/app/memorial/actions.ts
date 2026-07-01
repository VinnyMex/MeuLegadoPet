'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addTribute(memorialId: string, formData: FormData) {
  const supabase = await createClient()
  
  const guestName = formData.get('guestName') as string
  const message = formData.get('message') as string
  const file = formData.get('file') as File

  if (!guestName) throw new Error('Nome é obrigatório')

  let mediaId = null

  // If there's a file, we upload it anonymously or to a public folder
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const storagePath = `tributes/${memorialId}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('media_files')
      .upload(storagePath, file, { contentType: file.type })

    if (uploadError) throw new Error('Erro ao fazer upload da imagem')

    // Create a media_files record (no owner_id since it's a guest)
    const { data: mediaRecord, error: mediaError } = await supabase
      .from('media_files')
      .insert({
        storage_path: storagePath,
        media_type: file.type.startsWith('image/') ? 'image' : 'video'
      })
      .select('id')
      .single()

    if (!mediaError && mediaRecord) {
      mediaId = mediaRecord.id
    }
  }

  const { error } = await supabase.from('tributes').insert({
    memorial_id: memorialId,
    guest_name: guestName,
    message,
    media_id: mediaId
  })

  if (error) throw new Error('Erro ao salvar homenagem')
  
  // Try to find the pet/owner to revalidate
  const { data: memorial } = await supabase.from('memorials').select('slug, pets(owner_id)').eq('id', memorialId).single()
  if (memorial && memorial.pets) {
    revalidatePath(`/memorial/${(memorial.pets as any).owner_id}/${memorial.slug}`)
  }
}
