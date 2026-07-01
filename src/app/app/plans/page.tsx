import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase.from('plans').select('*').eq('active', true).order('monthly_price')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Escolha a melhor homenagem</h1>
        <p className="text-xl text-gray-500">Planos preventivos para garantir que a despedida seja apenas de amor, sem preocupações.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.monthly_price > 30 ? 'border-black shadow-xl ring-1 ring-black' : 'border-gray-200'}`}>
            <CardHeader className="text-center pb-8 pt-10">
              {plan.monthly_price > 30 && (
                <div className="w-full flex justify-center mb-4">
                  <span className="bg-black text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Mais Escolhido
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl font-semibold mb-2">{plan.name}</CardTitle>
              <div className="text-5xl font-bold tracking-tighter mb-2">
                {plan.monthly_price === 0 ? 'Grátis' : `R$ ${plan.monthly_price}`}
                {plan.monthly_price > 0 && <span className="text-lg text-gray-500 font-medium">/mês</span>}
              </div>
              <CardDescription className="text-base">Perfeito para quem pensa no futuro.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {(plan.coverage as string[])?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-8 pb-10">
              <Button className={`w-full py-6 text-lg rounded-xl ${plan.monthly_price > 30 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-black hover:bg-gray-200'}`}>
                {plan.monthly_price === 0 ? 'Continuar Grátis' : 'Assinar Agora'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
