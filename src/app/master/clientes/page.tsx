import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MasterClientes() {
  const supabase = await createClient()

  // Fetch all clients and their pets
  const { data: clients } = await supabase
    .from('profiles')
    .select('*, pets(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestão de Clientes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Todos os Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Data de Cadastro</th>
                  <th className="px-6 py-3">Pets Registrados</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {clients?.map((client: any) => (
                  <tr key={client.id} className="border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link href={`/master/clientes/${client.id}`} className="flex items-center gap-3 hover:text-indigo-600 transition-colors">
                        {client.avatar_url ? (
                          <img src={client.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {client.full_name?.charAt(0) || 'C'}
                          </div>
                        )}
                        {client.full_name || 'Usuário Sem Nome'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(client.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      {client.pets && client.pets.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {client.pets.map((pet: any) => {
                            const isDeceased = pet.status === 'falecido'
                            return (
                              <span 
                                key={pet.id} 
                                className={`text-xs px-2 py-1 rounded-full border ${isDeceased ? 'bg-gray-100 text-gray-500 border-gray-200 opacity-70' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}
                              >
                                {pet.name} ({pet.species})
                              </span>
                            )
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Nenhum pet</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Ativo</span>
                    </td>
                  </tr>
                ))}
                {(!clients || clients.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Nenhum cliente cadastrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
