'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart, Shield, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] overflow-x-hidden selection:bg-black selection:text-white">
      {/* Navigation - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 py-4 md:px-12 transition-all duration-300">
        <div className="font-semibold text-xl tracking-tight">Meu Legado Pet</div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium hover:text-gray-600 transition-colors">Entrar</Link>
          <Link href="/register" className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:scale-105 transition-transform">
            Começar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight max-w-4xl"
        >
          O amor deles <br className="hidden md:block" />
          <span className="text-gray-400">dura para sempre.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-xl md:text-2xl text-[#86868B] max-w-2xl font-medium tracking-tight"
        >
          Preserve a história, a saúde e a memória afetiva do seu pet em um espaço tão único quanto ele.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register" className="bg-[#0071E3] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#0077ED] transition-colors flex items-center justify-center gap-2">
            Criar o Legado <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-5xl aspect-video bg-gray-200 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative border-[8px] border-white"
        >
          {/* Imagem de placeholder elegante */}
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2000" 
            alt="Cães correndo na praia" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-12">
            <p className="text-white font-medium text-xl md:text-2xl tracking-wide drop-shadow-md">
              Uma vida de momentos, guardada com segurança.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tudo que ele merece.</h2>
            <p className="mt-4 text-xl text-[#86868B] font-medium">Design inteligente para memórias inestimáveis.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#F5F5F7] p-10 rounded-3xl"
            >
              <Heart className="w-12 h-12 text-[#FF2D55] mb-6" />
              <h3 className="text-2xl font-bold mb-3">Memorial Digital</h3>
              <p className="text-[#86868B] text-lg font-medium leading-relaxed">Uma página pública de homenagem eterna para celebrar a vida e o amor incondicional.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#F5F5F7] p-10 rounded-3xl"
            >
              <Clock className="w-12 h-12 text-[#0071E3] mb-6" />
              <h3 className="text-2xl font-bold mb-3">Linha do Tempo</h3>
              <p className="text-[#86868B] text-lg font-medium leading-relaxed">Guarde fotos, vídeos e textos cronologicamente desde o primeiro dia até a despedida.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-[#F5F5F7] p-10 rounded-3xl"
            >
              <Shield className="w-12 h-12 text-[#34C759] mb-6" />
              <h3 className="text-2xl font-bold mb-3">CRM de Saúde</h3>
              <p className="text-[#86868B] text-lg font-medium leading-relaxed">Controle vacinas, histórico médico e conecte-se a crematórios e planos preventivos.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F5F7] py-12 text-center text-[#86868B] text-sm">
        <p>Copyright © 2026 Meu Legado Pet. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
