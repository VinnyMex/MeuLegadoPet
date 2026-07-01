import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CreditCard, Receipt } from 'lucide-react'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*, pets(name)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch active plans
  const { data: userPlans } = await supabase
    .from('user_plans')
    .select('*, plans(*), pets(name)')
    .eq('profile_id', user.id)
    .eq('status', 'active')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Faturamento</h1>
        <p className="text-gray-500 mt-2">Gerencie suas assinaturas e histórico de pagamentos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Assinaturas Ativas</CardTitle>
          <CardDescription>Seus planos funerários e memoriais premium atuais.</CardDescription>
        </CardHeader>
        <CardContent>
          {userPlans && userPlans.length > 0 ? (
            <div className="space-y-4">
              {userPlans.map((up) => (
                <div key={up.id} className="flex items-center justify-between p-4 border rounded-xl bg-gray-50/50">
                  <div>
                    <p className="font-semibold text-lg">{(up.plans as any).name}</p>
                    <p className="text-sm text-gray-500">Para o pet: {(up.pets as any)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">R$ {(up.plans as any).monthly_price}</p>
                    <p className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">Ativo</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
              Você não possui assinaturas ativas.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{p.type === 'subscription' ? 'Mensalidade' : 'Pagamento Único'}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(p.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      {(p.pets as any)?.name && ` • ${(p.pets as any).name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {Number(p.amount).toFixed(2)}</p>
                    <p className={`text-xs font-medium ${p.status === 'paid' ? 'text-green-600' : p.status === 'pending' ? 'text-amber-500' : 'text-red-500'}`}>
                      {p.status === 'paid' ? 'Pago' : p.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum pagamento registrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
