'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Send, X, Loader2 } from 'lucide-react'
import { addTribute } from '../../actions'

export function TributeForm({ memorialId }: { memorialId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await addTribute(memorialId, formData)
      setIsOpen(false)
      setPreview(null)
      alert('Sua homenagem foi publicada com sucesso. Muito obrigado por compartilhar seu amor.')
    } catch (err) {
      alert('Ocorreu um erro ao enviar a homenagem.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-20 mb-20">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-8 py-4 rounded-full font-medium flex items-center justify-center shadow-xl hover:shadow-2xl transition-all"
      >
        Deixar uma Homenagem
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                title="Fechar"
                aria-label="Fechar"
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-semibold mb-6">Deixar Homenagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input 
                    name="guestName" 
                    placeholder="Seu nome" 
                    required 
                    className="w-full text-lg border-b-2 border-gray-100 py-3 focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <textarea 
                    name="message" 
                    placeholder="Escreva uma mensagem de carinho..." 
                    rows={4}
                    className="w-full text-lg border-b-2 border-gray-100 py-3 focus:outline-none focus:border-black transition-colors resize-none placeholder:text-gray-300"
                  />
                </div>


                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-xl font-medium flex justify-center items-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? 'Enviando...' : 'Publicar Homenagem'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
