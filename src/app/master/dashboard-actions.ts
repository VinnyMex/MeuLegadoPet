'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAppointmentStatus(appId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appId)

  if (error) throw new Error(error.message)
    
  revalidatePath('/master')
}
