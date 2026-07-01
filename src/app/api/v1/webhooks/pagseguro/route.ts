import { NextResponse } from 'next/server'
import { db } from '@/db/drizzle'
import { payments } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    // Em produção, você DEVE validar a assinatura/token que o PagSeguro envia nos headers
    // para garantir que a requisição é legítima.

    const body = await req.json()
    
    // O payload exato depende da versão da API do PagSeguro
    const transactionCode = body.id || body.reference_id
    const newStatus = body.charges?.[0]?.status || body.status // ex: 'PAID', 'DECLINED'

    if (!transactionCode || !newStatus) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    // Atualizar o status do pagamento no banco
    await db.update(payments)
      .set({ 
        status: newStatus.toLowerCase(),
        paid_at: newStatus === 'PAID' ? new Date() : null
      })
      .where(eq(payments.transaction_code, transactionCode))

    // NOTA: Se for uma assinatura, aqui você também atualizaria a tabela user_plans

    return NextResponse.json({ success: true, message: 'Webhook recebido com sucesso' })

  } catch (error) {
    console.error('Erro no Webhook do PagSeguro:', error)
    return NextResponse.json({ error: 'Erro interno ao processar webhook' }, { status: 500 })
  }
}
