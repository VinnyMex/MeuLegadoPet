'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateMemorial(petId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const slug = formData.get('slug') as string
  const title = formData.get('title') as string
  const mainMessage = formData.get('mainMessage') as string
  const visibility = formData.get('visibility') as string || 'private'
  const active = formData.get('active') === 'on'

  // Verificar propriedade do pet
  const { data: pet } = await supabase.from('pets').select('id').eq('id', petId).eq('owner_id', user.id).single()
  if (!pet) throw new Error('Not authorized')

  let galleryUrls = undefined;
  if (formData.has('gallery_urls')) {
    try {
      galleryUrls = JSON.parse(formData.get('gallery_urls') as string);
    } catch(e) {}
  }

  // Buscar ou criar o memorial
  const { data: existingMemorial } = await supabase.from('memorials').select('id').eq('pet_id', petId).single()

  const payload: any = {
    slug, title, main_message: mainMessage, visibility, active, updated_at: new Date().toISOString()
  }
  
  if (galleryUrls !== undefined) {
    payload.gallery_urls = galleryUrls;
  }

  if (existingMemorial) {
    await supabase.from('memorials').update(payload).eq('id', existingMemorial.id)
  } else {
    payload.pet_id = petId;
    await supabase.from('memorials').insert(payload)
  }

  revalidatePath(`/app/pets/${petId}`)
}

