import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PawPrint, Calendar, User, LogOut } from 'lucide-react'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Pegar dados do profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar Desktop & Mobile Nav */}
      <aside className="w-full md:w-64 bg-white border-r md:min-h-screen p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-8 px-2">
            <PawPrint className="h-6 w-6 text-amber-600" />
            <span>Meu Legado Pet</span>
          </div>
          <nav className="space-y-2">
            <Link href="/app" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
              <PawPrint className="h-5 w-5" />
              Meus Pets
            </Link>
            <Link href="/app/agenda" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium">
              <Calendar className="h-5 w-5" />
              Agenda
            </Link>
            {profile?.role === 'admin' && (
              <Link href="/master" className="flex items-center gap-3 px-3 py-2 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium mt-4">
                <User className="h-5 w-5" />
                Painel Master (B2B)
              </Link>
            )}
          </nav>
        </div>
        
        <div className="pt-8 border-t mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium truncate flex-1">
              {profile?.full_name || user.email}
            </div>
          </div>
          <form action="/auth/logout" method="post">
            <button className="flex w-full items-center gap-3 px-3 py-2 mt-2 rounded-md hover:bg-red-50 text-red-600 font-medium text-sm">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
