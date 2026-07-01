'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function masterUpdatePet(petId: string, profileId: string, formData: FormData) {
  const supabase = await createClient()

  // Verifica se é admin (master)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Acesso negado')
  }

  const name = formData.get('name') as string
  const species = formData.get('species') as string
  const breed = formData.get('breed') as string
  const birth_date = formData.get('birth_date') as string
  const weight_kg = formData.get('weight_kg') as string
  const status = formData.get('status') as string
  const deceased_date = formData.get('deceased_date') as string

  const payload: any = {
    name,
    species,
    breed: breed || null,
    birth_date: birth_date || null,
    weight_kg: weight_kg ? parseFloat(weight_kg) : null,
    status: status || 'vivo',
    deceased_date: deceased_date || null,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase.from('pets').update(payload).eq('id', petId)
  
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/master/clientes/${profileId}`)
  revalidatePath(`/master/pets/${petId}`)
  
  redirect(`/master/clientes/${profileId}`)
}
