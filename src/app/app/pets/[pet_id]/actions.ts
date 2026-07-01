'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPetAvatar(petId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authorized')
  }

  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  // Verificar se o pet pertence ao usuário
  const { data: pet } = await supabase
    .from('pets')
    .select('id')
    .eq('id', petId)
    .eq('owner_id', user.id)
    .single()

  if (!pet) {
    throw new Error('Pet not found or unauthorized')
  }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${petId}/avatar_${Date.now()}.${fileExt}`

  // 1. Upload para o bucket
  const { error: uploadError } = await supabase.storage
    .from('media_files')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    })

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError)
    throw new Error('Failed to upload image')
  }

  // 2. Pegar URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('media_files')
    .getPublicUrl(filePath)

  // 3. Atualizar o cadastro do Pet
  const { error: updateError } = await supabase
    .from('pets')
    .update({ avatar_url: publicUrl })
    .eq('id', petId)

  if (updateError) {
    console.error('Database Update Error:', updateError)
    throw new Error('Failed to update pet avatar')
  }

  revalidatePath(`/app/pets/${petId}`)
  return { publicUrl }
}

export async function addVaccine(petId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const vaccineName = formData.get('name') as string
  const dateApplied = formData.get('date') as string
  
  if (!vaccineName || !dateApplied) throw new Error('Missing fields')

  // Buscar registro de saúde existente
  const { data: healthRecord } = await supabase
    .from('pet_health')
    .select('id, vaccines')
    .eq('pet_id', petId)
    .single()

  const newVaccine = {
    id: crypto.randomUUID(),
    name: vaccineName,
    date_applied: dateApplied,
    created_at: new Date().toISOString()
  }

  if (healthRecord) {
    // Atualizar JSONB
    const currentVaccines = Array.isArray(healthRecord.vaccines) ? healthRecord.vaccines : []
    await supabase
      .from('pet_health')
      .update({ vaccines: [...currentVaccines, newVaccine] })
      .eq('id', healthRecord.id)
  } else {
    // Criar novo registro
    await supabase
      .from('pet_health')
      .insert({
        pet_id: petId,
        vaccines: [newVaccine]
      })
  }

  revalidatePath(`/app/pets/${petId}`)
}

export async function addTimelineEntry(petId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  let entryType = formData.get('entryType') as string || 'text'
  const eventDate = formData.get('eventDate') as string || new Date().toISOString()
  const file = formData.get('file') as File

  let mediaId = null

  // 1. Get or Create Timeline
  let { data: timeline } = await supabase
    .from('timelines')
    .select('id')
    .eq('pet_id', petId)
    .single()

  if (!timeline) {
    const { data: newTimeline, error: tlError } = await supabase
      .from('timelines')
      .insert({ pet_id: petId })
      .select('id')
      .single()
    if (tlError) throw new Error('Error creating timeline')
    timeline = newTimeline
  }

  // 2. Upload file if exists
  if (file && file.size > 0) {
    entryType = file.type.startsWith('video/') ? 'video' : 'photo'
    const fileExt = file.name.split('.').pop()
    const storagePath = `${user.id}/${petId}/timeline_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('media_files')
      .upload(storagePath, file, { upsert: true, contentType: file.type })

    if (uploadError) throw new Error('Failed to upload media')

    const { data: mediaRecord, error: mediaError } = await supabase
      .from('media_files')
      .insert({
        owner_id: user.id,
        pet_id: petId,
        storage_path: storagePath,
        media_type: entryType
      })
      .select('id')
      .single()

    if (mediaError) throw new Error('Failed to link media')
    mediaId = mediaRecord.id
  }

  // 3. Create entry
  const { error: entryError } = await supabase
    .from('timeline_entries')
    .insert({
      timeline_id: timeline.id,
      pet_id: petId,
      entry_type: entryType,
      title,
      content,
      media_id: mediaId,
      event_date: eventDate
    })

  if (entryError) throw new Error('Error creating timeline entry')

  revalidatePath(`/app/pets/${petId}`)
}

export async function addMedication(petId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const dosage = formData.get('dosage') as string
  if (!name) return

  const { data: healthRecord } = await supabase.from('pet_health').select('id, medications').eq('pet_id', petId).single()
  const newMed = { id: crypto.randomUUID(), name, dosage, date: new Date().toISOString() }

  if (healthRecord) {
    const meds = Array.isArray(healthRecord.medications) ? healthRecord.medications : []
    await supabase.from('pet_health').update({ medications: [...meds, newMed] }).eq('id', healthRecord.id)
  } else {
    await supabase.from('pet_health').insert({ pet_id: petId, medications: [newMed] })
  }
  revalidatePath(`/app/pets/${petId}`)
}

export async function addCondition(petId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const notes = formData.get('notes') as string
  if (!name) return

  const { data: healthRecord } = await supabase.from('pet_health').select('id, conditions').eq('pet_id', petId).single()
  const newCond = { id: crypto.randomUUID(), name, notes, date: new Date().toISOString() }

  if (healthRecord) {
    const conds = Array.isArray(healthRecord.conditions) ? healthRecord.conditions : []
    await supabase.from('pet_health').update({ conditions: [...conds, newCond] }).eq('id', healthRecord.id)
  } else {
    await supabase.from('pet_health').insert({ pet_id: petId, conditions: [newCond] })
  }
  revalidatePath(`/app/pets/${petId}`)
}

export async function addAllergy(petId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const severity = formData.get('severity') as string
  if (!name) return

  const { data: healthRecord } = await supabase.from('pet_health').select('id, allergies').eq('pet_id', petId).single()
  const newAllergy = { id: crypto.randomUUID(), name, severity, date: new Date().toISOString() }

  if (healthRecord) {
    const allergies = Array.isArray(healthRecord.allergies) ? healthRecord.allergies : []
    await supabase.from('pet_health').update({ allergies: [...allergies, newAllergy] }).eq('id', healthRecord.id)
  } else {
    await supabase.from('pet_health').insert({ pet_id: petId, allergies: [newAllergy] })
  }
  revalidatePath(`/app/pets/${petId}`)
}
