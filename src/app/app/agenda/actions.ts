'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function requestAppointment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const petId = formData.get('pet_id') as string
  const serviceType = formData.get('service_type') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const notes = formData.get('notes') as string

  if (!petId || !serviceType || !date || !time) {
    throw new Error('Todos os campos obrigatórios devem ser preenchidos.')
  }

  // Verificar se o pet pertence ao usuário
  const { data: pet } = await supabase.from('pets').select('id').eq('id', petId).eq('owner_id', user.id).single()
  if (!pet) throw new Error('Pet não encontrado ou não autorizado.')

  // Combinar data e hora
  const appointmentDate = new Date(`${date}T${time}:00`).toISOString()

  const { error } = await supabase.from('appointments').insert({
    profile_id: user.id,
    pet_id: petId,
    service_type: serviceType,
    appointment_date: appointmentDate,
    status: 'solicitado', // Fica como solicitado até o admin confirmar
    payment_status: 'pendente',
    notes: notes || null
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/app/agenda')
  revalidatePath('/master/agenda')
}

export async function updateClientAppointment(appId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const petId = formData.get('pet_id') as string
  const serviceType = formData.get('service_type') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const notes = formData.get('notes') as string

  if (!petId || !serviceType || !date || !time) {
    throw new Error('Todos os campos obrigatórios devem ser preenchidos.')
  }

  // Verificar se o agendamento pertence ao usuário e se o status é 'solicitado'
  const { data: appointment } = await supabase
    .from('appointments')
    .select('id, status')
    .eq('id', appId)
    .eq('profile_id', user.id)
    .single()

  if (!appointment) throw new Error('Agendamento não encontrado.')
  if (appointment.status !== 'solicitado') throw new Error('Apenas solicitações pendentes podem ser editadas pelo cliente.')

  const appointmentDate = new Date(`${date}T${time}:00`).toISOString()

  const { error } = await supabase.from('appointments').update({
    pet_id: petId,
    service_type: serviceType,
    appointment_date: appointmentDate,
    notes: notes || null
  }).eq('id', appId)

  if (error) throw new Error(error.message)

  revalidatePath('/app')
  revalidatePath('/app/agenda')
  revalidatePath('/master/agenda')
}

export async function cancelClientAppointment(appId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authorized')

  const { data: appointment } = await supabase
    .from('appointments')
    .select('id, status')
    .eq('id', appId)
    .eq('profile_id', user.id)
    .single()

  if (!appointment) throw new Error('Agendamento não encontrado.')
  if (appointment.status !== 'solicitado') throw new Error('Você só pode cancelar agendamentos que ainda não foram confirmados. Para cancelar agendamentos já confirmados, entre em contato via WhatsApp.')

  const { error } = await supabase.from('appointments').update({
    status: 'cancelado'
  }).eq('id', appId)

  if (error) throw new Error(error.message)

  revalidatePath('/app')
  revalidatePath('/app/agenda')
  revalidatePath('/master/agenda')
}
