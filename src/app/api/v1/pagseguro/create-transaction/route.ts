import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db/drizzle'
import { payments } from '@/db/schema'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { pet_id, amount, plan_name } = body

    if (!amount) {
      return NextResponse.json({ error: 'Valor é obrigatório' }, { status: 400 })
    }

    const orderId = randomUUID()

    // 1. Chamar a API do PagSeguro (Simulação para o MVP / Sandbox)
    const pagSeguroToken = process.env.PAGSEGURO_TOKEN
    
    // A implementação real faria um fetch(https://sandbox.api.pagseguro.com/orders)
    // omitido aqui para manter simplicidade do boilerplate
    // const response = await fetch(...)
    
    // Simulação do retorno do PagSeguro
    const transactionCode = `PS-${orderId.substring(0, 8)}`.toUpperCase()

    // 2. Salvar no banco de dados com Drizzle
    await db.insert(payments).values({
      profile_id: user.id,
      pet_id: pet_id || null,
      amount: amount.toString(),
      status: 'pending',
      transaction_code: transactionCode,
      type: 'plan_subscription'
    })

    // 3. Retornar link de pagamento (Simulado)
    const paymentUrl = `https://sandbox.pagseguro.uol.com.br/checkout/payment.html?code=${transactionCode}`

    return NextResponse.json({ 
      success: true, 
      orderId, 
      transactionCode, 
      paymentUrl 
    })

  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
