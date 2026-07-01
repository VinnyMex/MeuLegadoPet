import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Phone, Dog, MapPin, Gift, MessageCircle } from 'lucide-react'
import { EditClientForm } from './edit-client-form'
import { AddPetButton } from './add-pet-button'
import { AddAppointmentButton } from './add-appointment-button'

export const dynamic = 'force-dynamic'

export default async function ClientDetails(props: { params: Promise<{ profile_id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('profiles')
    .select('*, pets(*), appointments(*)')
    .eq('id', params.profile_id)
    .single()

  if (!client) {
    return <div className="p-8">Cliente não encontrado.</div>
  }

  const confirmedClientApps = client.appointments?.filter((a: any) => a.status === 'agendado' || a.status === 'concluido') || []
  const completedRevenue = confirmedClientApps.filter((a: any) => a.payment_status === 'pago' && a.price).reduce((acc: number, curr: any) => acc + Number(curr.price), 0) || 0
  const pendingRevenue = confirmedClientApps.filter((a: any) => a.payment_status === 'pendente' && a.price).reduce((acc: number, curr: any) => acc + Number(curr.price), 0) || 0

  // Whatsapp Button Setup
  const cleanPhone = client.phone ? client.phone.replace(/\D/g, '') : ''
  const petNames = client.pets && client.pets.length > 0 ? client.pets.map((p:any) => p.name).join(', ') : 'seu pet'
  const whatsappMessage = encodeURIComponent(`Olá ${client.full_name}, estou entrando em contato sobre o(s) seu(s) pet(s) ${petNames}. O status atual é...`)
  const whatsappUrl = cleanPhone ? `https://wa.me/55${cleanPhone}?text=${whatsappMessage}` : '#'

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <Link href="/master/clientes" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Clientes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            {client.avatar_url ? (
              <img src={client.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-indigo-50 object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl border-4 border-indigo-50">
                {client.full_name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.full_name || 'Usuário Sem Nome'}</h1>
              <div className="text-gray-500 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400"/> {client.email || 'Email não cadastrado'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400"/> {client.phone || 'Telefone não cadastrado'}
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-4 h-4 text-gray-400"/> {client.birth_date ? new Date(client.birth_date).toLocaleDateString('pt-BR') : 'Aniversário não cadastrado'}
                </span>
              </div>
            </div>
          </div>
          
          {cleanPhone && (
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap shadow-sm mt-4 md:mt-0"
            >
              <MessageCircle className="w-5 h-5" /> Enviar Mensagem (WhatsApp)
            </a>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full flex justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto overflow-y-hidden whitespace-nowrap [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3">
            Visão Geral (Pets & Agenda)
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3">
            Editar Cadastro CRM
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0 outline-none space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Pets ({client.pets?.length || 0})</CardTitle>
                <AddPetButton ownerId={client.id} />
              </CardHeader>
              <CardContent className="space-y-4">
                {client.pets?.map((pet: any) => {
                  const isDeceased = pet.status === 'falecido'
                  return (
                    <Link key={pet.id} href={`/master/pets/${pet.id}`} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-300 transition-colors ${isDeceased ? 'opacity-60 grayscale' : ''}`}>
                      {pet.avatar_url ? (
                        <img src={pet.avatar_url} alt={pet.name} className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                          <Dog className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{pet.name}</p>
                          {isDeceased && <span className="text-[10px] uppercase font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Falecido</span>}
                        </div>
                        <p className="text-xs text-gray-500 capitalize">
                          {pet.species} • {pet.breed || 'SRD'} {pet.sex ? `• ${pet.sex === 'M' ? 'M' : pet.sex === 'F' ? 'F' : pet.sex} ` : ''}• {pet.birth_date ? Math.abs(new Date().getUTCFullYear() - new Date(pet.birth_date).getUTCFullYear()) + ' Anos' : 'Idade n/a'} {pet.weight_kg ? `• ${pet.weight_kg}kg` : ''}
                        </p>
                      </div>
                      <div className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Editar</div>
                    </Link>
                  )
                })}
                {(!client.pets || client.pets.length === 0) && (
                  <p className="text-sm text-gray-500">Nenhum pet cadastrado.</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Histórico Financeiro & Agenda</CardTitle>
                  <CardDescription className="mt-1">Resumo financeiro: Pago R$ {completedRevenue.toFixed(2)} | A Receber: R$ {pendingRevenue.toFixed(2)}</CardDescription>
                </div>
                <AddAppointmentButton client={client} />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Data/Hora (BRT)</th>
                        <th className="px-4 py-2">Serviço</th>
                        <th className="px-4 py-2">Valor</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Pagamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.appointments?.map((app: any) => (
                        <tr key={app.id} className="border-b">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {new Date(app.appointment_date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                          </td>
                          <td className="px-4 py-3 capitalize">{app.service_type}</td>
                          <td className="px-4 py-3 font-medium">R$ {app.price ? Number(app.price).toFixed(2).replace('.', ',') : '0,00'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${app.status === 'solicitado' ? 'bg-orange-100 text-orange-800' : app.status === 'agendado' ? 'bg-sky-100 text-sky-800' : app.status === 'concluido' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${app.payment_status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {app.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!client.appointments || client.appointments.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center text-gray-500">Nenhum agendamento registrado.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-0 outline-none">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro Completo CRM</CardTitle>
              <CardDescription>Mantenha os dados do cliente sempre atualizados para facilitar o contato e o marketing.</CardDescription>
            </CardHeader>
            <CardContent>
              <EditClientForm client={client} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
