'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function checkMasterAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Acesso negado')
  }
  return { user, supabase }
}

export async function masterAddVaccine(petId: string, formData: FormData) {
  const { supabase } = await checkMasterAuth()

  const vaccineName = formData.get('name') as string
  const dateApplied = formData.get('date') as string
  if (!vaccineName || !dateApplied) throw new Error('Missing fields')

  const { data: healthRecord } = await supabase.from('pet_health').select('id, vaccines').eq('pet_id', petId).single()
  const newVaccine = { id: crypto.randomUUID(), name: vaccineName, date_applied: dateApplied, created_at: new Date().toISOString() }

  if (healthRecord) {
    const currentVaccines = Array.isArray(healthRecord.vaccines) ? healthRecord.vaccines : []
    await supabase.from('pet_health').update({ vaccines: [...currentVaccines, newVaccine] }).eq('id', healthRecord.id)
  } else {
    await supabase.from('pet_health').insert({ pet_id: petId, vaccines: [newVaccine] })
  }
  revalidatePath(`/master/pets/${petId}`)
}

export async function masterAddMedication(petId: string, formData: FormData) {
  const { supabase } = await checkMasterAuth()
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
  revalidatePath(`/master/pets/${petId}`)
}

export async function masterAddCondition(petId: string, formData: FormData) {
  const { supabase } = await checkMasterAuth()
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
  revalidatePath(`/master/pets/${petId}`)
}

export async function masterAddAllergy(petId: string, formData: FormData) {
  const { supabase } = await checkMasterAuth()
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
  revalidatePath(`/master/pets/${petId}`)
}

export async function masterAddTimelineEntry(petId: string, formData: FormData) {
  const { supabase, user } = await checkMasterAuth()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  let entryType = formData.get('entryType') as string || 'text'
  const eventDate = formData.get('eventDate') as string || new Date().toISOString()
  const file = formData.get('file') as File

  let mediaId = null

  let { data: timeline } = await supabase.from('timelines').select('id').eq('pet_id', petId).single()
  if (!timeline) {
    const { data: newTimeline, error: tlError } = await supabase.from('timelines').insert({ pet_id: petId }).select('id').single()
    if (tlError) throw new Error('Error creating timeline')
    timeline = newTimeline
  }

  if (file && file.size > 0) {
    entryType = file.type.startsWith('video/') ? 'video' : 'photo'
    const fileExt = file.name.split('.').pop()
    const storagePath = `${user.id}/${petId}/timeline_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('media_files').upload(storagePath, file, { upsert: true, contentType: file.type })
    if (uploadError) throw new Error('Failed to upload media')

    const { data: mediaRecord, error: mediaError } = await supabase.from('media_files').insert({
      owner_id: user.id, // Using the admin user as owner of the media file uploaded by master
      pet_id: petId,
      storage_path: storagePath,
      media_type: entryType
    }).select('id').single()

    if (mediaError) throw new Error('Failed to link media')
    mediaId = mediaRecord.id
  }

  const { error: entryError } = await supabase.from('timeline_entries').insert({
    timeline_id: timeline.id,
    pet_id: petId,
    entry_type: entryType,
    title,
    content,
    media_id: mediaId,
    event_date: eventDate
  })

  if (entryError) throw new Error('Error creating timeline entry')
  revalidatePath(`/master/pets/${petId}`)
}
