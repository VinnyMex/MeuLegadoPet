'use client'

import { useEffect } from 'react'
import { cleanupOldImages } from './actions'

export function AutoCleanup() {
  useEffect(() => {
    // Run cleanup silently in the background when admin accesses the panel
    cleanupOldImages().catch(console.error)
  }, [])
  
  return null
}
