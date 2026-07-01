'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function masterUpdateClient(profileId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error('Acesso negado')
  }

  const payload = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    birth_date: (formData.get('birth_date') as string) || null,
    cep: formData.get('cep') as string,
    address: formData.get('address') as string,
    address_number: formData.get('address_number') as string,
    address_complement: formData.get('address_complement') as string,
    neighborhood: formData.get('neighborhood') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase.from('profiles').update(payload).eq('id', profileId)
  
  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/master/clientes/${profileId}`)
}
