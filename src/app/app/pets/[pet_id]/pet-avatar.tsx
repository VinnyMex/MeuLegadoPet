'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { uploadPetAvatar } from './actions'

export function PetAvatarClient({ petId, currentUrl, petName }: { petId: string, currentUrl?: string | null, petName: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Como usamos Server Actions com revalidatePath, 
  // o Next.js atualizará o componente pai (Server Component) automaticamente.

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await uploadPetAvatar(petId, formData)
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar foto')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative group">
      <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg">
        <AvatarImage src={currentUrl || ''} className="object-cover" />
        <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-bold">
          {petName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div 
        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Camera className="w-8 h-8 text-white" />
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        title="Escolher foto de perfil"
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  )
}
