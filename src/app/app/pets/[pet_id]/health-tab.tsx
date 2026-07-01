import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addVaccine, addMedication, addCondition, addAllergy } from './actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Syringe, Pill, Stethoscope, AlertTriangle } from 'lucide-react'

export function HealthTab({ petId, healthRecord }: { petId: string, healthRecord: any }) {
  const vaccines = healthRecord?.vaccines || []
  const medications = healthRecord?.medications || []
  const conditions = healthRecord?.conditions || []
  const allergies = healthRecord?.allergies || []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Vacinas */}
        <Card className="border-sky-100 shadow-sm">
          <CardHeader className="bg-sky-50/50 rounded-t-xl pb-4 border-b border-sky-100">
            <CardTitle className="text-lg flex items-center gap-2 text-sky-900">
              <Syringe className="h-5 w-5 text-sky-600" />
              Controle de Vacinas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={addVaccine.bind(null, petId)} className="flex flex-col gap-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="vaccine-name" className="text-xs">Vacina</Label>
                  <Input id="vaccine-name" name="name" required placeholder="Ex: V10" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vaccine-date" className="text-xs">Data</Label>
                  <Input id="vaccine-date" name="date" type="date" required className="h-8 text-sm" />
                </div>
              </div>
              <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-700 w-full text-xs h-8">Adicionar Vacina</Button>
            </form>
            <div className="space-y-2">
              {vaccines.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">Nenhuma vacina registrada.</p>
              ) : (
                <ul className="space-y-2">
                  {vaccines.map((v: any) => (
                    <li key={v.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border text-xs">
                      <span className="font-medium text-gray-700">{v.name}</span>
                      <span className="text-gray-500">{format(new Date(v.date_applied), "dd/MM/yyyy")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos */}
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 rounded-t-xl pb-4 border-b border-emerald-100">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
              <Pill className="h-5 w-5 text-emerald-600" />
              Medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={addMedication.bind(null, petId)} className="flex flex-col gap-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="med-name" className="text-xs">Remédio</Label>
                  <Input id="med-name" name="name" required placeholder="Ex: Bravecto" className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="med-dosage" className="text-xs">Dosagem/Ref</Label>
                  <Input id="med-dosage" name="dosage" placeholder="Ex: 1 comp" className="h-8 text-sm" />
                </div>
              </div>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 w-full text-xs h-8">Adicionar Medicamento</Button>
            </form>
            <div className="space-y-2">
              {medications.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-2">Nenhum medicamento registrado.</p>
              ) : (
                <ul className="space-y-2">
                  {medications.map((m: any) => (
                    <li key={m.id} className="flex justify-between items-center p-2 bg-gray-50 rounded border text-xs">
                      <span className="font-medium text-gray-700">{m.name}</span>
                      <span className="text-gray-500">{m.dosage}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consultas e Histórico Clínico */}
        <Card className="border-indigo-100 shadow-sm md:col-span-2">
          <CardHeader className="bg-indigo-50/50 rounded-t-xl pb-4 border-b border-indigo-100">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <Stethoscope className="h-5 w-5 text-indigo-600" />
              Consultas e Exames
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={addCondition.bind(null, petId)} className="flex flex-col md:flex-row items-end gap-3 mb-6">
              <div className="space-y-1 flex-1 w-full">
                <Label htmlFor="cond-name" className="text-xs">Motivo / Título</Label>
                <Input id="cond-name" name="name" required placeholder="Ex: Consulta de Rotina" className="h-8 text-sm" />
              </div>
              <div className="space-y-1 flex-1 w-full">
                <Label htmlFor="cond-notes" className="text-xs">Observações</Label>
                <Input id="cond-notes" name="notes" placeholder="Ex: Tudo ótimo, peso 15kg" className="h-8 text-sm" />
              </div>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto text-xs h-8">Registrar</Button>
            </form>
            <div className="space-y-2">
              {conditions.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">Nenhuma consulta registrada.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conditions.map((c: any) => (
                    <li key={c.id} className="flex flex-col p-3 bg-gray-50 rounded border text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800">{c.name}</span>
                        <span className="text-xs text-gray-500">{format(new Date(c.date), "dd/MM/yyyy")}</span>
                      </div>
                      <span className="text-gray-600 text-xs mt-1">{c.notes}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alergias e Alertas */}
        <Card className="border-red-100 shadow-sm md:col-span-2">
          <CardHeader className="bg-red-50/50 rounded-t-xl pb-4 border-b border-red-100">
            <CardTitle className="text-lg flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Alergias e Alertas Médicos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form action={addAllergy.bind(null, petId)} className="flex flex-col md:flex-row items-end gap-3 mb-6">
              <div className="space-y-1 flex-1 w-full">
                <Label htmlFor="al-name" className="text-xs">Alergia / Alerta</Label>
                <Input id="al-name" name="name" required placeholder="Ex: Alergia a Frango" className="h-8 text-sm" />
              </div>
              <div className="space-y-1 w-full md:w-48">
                <Label htmlFor="al-severity" className="text-xs">Gravidade</Label>
                <select id="al-severity" name="severity" title="Gravidade" className="flex h-8 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
              <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 w-full md:w-auto text-xs h-8">Adicionar</Button>
            </form>
            
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allergies.map((a: any) => (
                  <span key={a.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <AlertTriangle className="w-3 h-3" />
                    {a.name} ({a.severity})
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
