'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { masterUpdateClient } from './actions'

export function EditClientForm({ client }: { client: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // States for CEP autofill
  const [address, setAddress] = useState(client.address || '')
  const [neighborhood, setNeighborhood] = useState(client.neighborhood || '')
  const [city, setCity] = useState(client.city || '')
  const [state, setState] = useState(client.state || '')
  const [isFetchingCep, setIsFetchingCep] = useState(false)

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length !== 8) return

    setIsFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setAddress(data.logradouro)
        setNeighborhood(data.bairro)
        setCity(data.localidade)
        setState(data.uf)
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err)
    } finally {
      setIsFetchingCep(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await masterUpdateClient(client.id, formData)
      alert('Dados do cliente atualizados com sucesso!')
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input id="full_name" name="full_name" required defaultValue={client.full_name} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={client.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (WhatsApp)</Label>
          <Input id="phone" name="phone" placeholder="Ex: 11999999999" defaultValue={client.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input id="birth_date" name="birth_date" type="date" defaultValue={client.birth_date} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep" className="flex items-center gap-2">
            CEP {isFetchingCep && <Loader2 className="w-3 h-3 animate-spin" />}
          </Label>
          <Input id="cep" name="cep" defaultValue={client.cep} onBlur={handleCepBlur} placeholder="Apenas números" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço (Rua/Avenida)</Label>
          <Input id="address" name="address" value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address_number">Número</Label>
            <Input id="address_number" name="address_number" defaultValue={client.address_number} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address_complement">Complemento</Label>
            <Input id="address_complement" name="address_complement" defaultValue={client.address_complement} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" name="neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" name="city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado (UF)</Label>
            <Input id="state" name="state" value={state} onChange={e => setState(e.target.value)} maxLength={2} />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto">
        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Salvar Informações
      </Button>
    </form>
  )
}
