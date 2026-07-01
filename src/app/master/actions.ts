'use server'
import { createClient } from '@/lib/supabase/server'

export async function cleanupOldImages() {
  const supabase = await createClient()
  
  // Find images older than 15 days
  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

  const { data: oldImages } = await supabase
    .from('appointment_images')
    .select('*')
    .lt('created_at', fifteenDaysAgo.toISOString())

  if (oldImages && oldImages.length > 0) {
    const pathsToRemove = oldImages.map(img => img.storage_path)
    
    // 1. Delete all from storage bucket
    await supabase.storage.from('media').remove(pathsToRemove)
    
    // 2. Delete all from DB
    const idsToRemove = oldImages.map(img => img.id)
    await supabase.from('appointment_images').delete().in('id', idsToRemove)
  }
}
