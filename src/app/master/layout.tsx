import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Calendar, DollarSign, LogOut, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AutoCleanup } from './auto-cleanup'

export default async function MasterLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AutoCleanup />
      {/* Sidebar B2B */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded">ML</span> Master CRM
          </h2>
          <p className="text-gray-400 text-xs mt-1">Gestão de Operações</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/master" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" /> Dashboard
          </Link>
          <Link href="/master/clientes" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">
            <Users className="w-5 h-5 text-gray-400" /> Clientes & Pets
          </Link>
          <Link href="/master/agenda" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">
            <Calendar className="w-5 h-5 text-gray-400" /> Agenda Global
          </Link>
          <Link href="/master/financeiro" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors">
            <DollarSign className="w-5 h-5 text-gray-400" /> Financeiro
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/app" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition-colors text-gray-300">
            <ArrowLeft className="w-5 h-5" /> Voltar ao App Tutor
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-red-900/50 hover:text-red-300 text-sm font-medium transition-colors text-gray-300">
              <LogOut className="w-5 h-5" /> Sair do Sistema
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
