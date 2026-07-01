'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Syringe, Pill, Stethoscope, AlertTriangle, Image as ImageIcon, Video, MoreHorizontal, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function HistoryTab({ petId, healthRecord, entries }: { petId: string, healthRecord: any, entries: any[] }) {
  
  // Mapear eventos
  const timelineItems: any[] = []

  // 1. Vacinas
  const vaccines = healthRecord?.vaccines || []
  vaccines.forEach((v: any) => {
    timelineItems.push({
      id: `vac-${v.id}`,
      type: 'vaccine',
      date: new Date(v.date_applied || v.created_at || new Date()),
      title: `Vacina: ${v.name}`,
      description: 'Vacinação registrada.',
      icon: <Syringe className="h-4 w-4" />,
      colorClass: 'bg-sky-100 text-sky-600 border-sky-200'
    })
  })

  // 2. Medicamentos
  const medications = healthRecord?.medications || []
  medications.forEach((m: any) => {
    timelineItems.push({
      id: `med-${m.id}`,
      type: 'medication',
      date: new Date(m.date || new Date()),
      title: `Medicamento: ${m.name}`,
      description: `Dosagem: ${m.dosage}`,
      icon: <Pill className="h-4 w-4" />,
      colorClass: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    })
  })

  // 3. Consultas/Condições
  const conditions = healthRecord?.conditions || []
  conditions.forEach((c: any) => {
    timelineItems.push({
      id: `cond-${c.id}`,
      type: 'condition',
      date: new Date(c.date || new Date()),
      title: `Consulta/Exame: ${c.name}`,
      description: c.notes,
      icon: <Stethoscope className="h-4 w-4" />,
      colorClass: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    })
  })

  // 4. Alergias
  const allergies = healthRecord?.allergies || []
  allergies.forEach((a: any) => {
    timelineItems.push({
      id: `al-${a.id}`,
      type: 'allergy',
      date: new Date(a.date || new Date()),
      title: `Alergia/Alerta: ${a.name}`,
      description: `Gravidade: ${a.severity}`,
      icon: <AlertTriangle className="h-4 w-4" />,
      colorClass: 'bg-red-100 text-red-600 border-red-200'
    })
  })

  // 5. Linha do Tempo Geral
  entries.forEach((e: any) => {
    let icon = <MoreHorizontal className="h-4 w-4" />
    if (e.entry_type === 'photo') icon = <ImageIcon className="h-4 w-4" />
    if (e.entry_type === 'video') icon = <Video className="h-4 w-4" />

    timelineItems.push({
      id: `entry-${e.id}`,
      type: 'timeline',
      date: new Date(e.event_date || e.created_at || new Date()),
      title: e.title,
      description: e.content,
      media: e.media_files,
      icon: icon,
      colorClass: 'bg-amber-100 text-amber-600 border-amber-200'
    })
  })

  // Ordenar decrescente
  timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Activity className="h-6 w-6 text-primary" /> Histórico Clínico e Linha do Tempo
        </h2>
        <p className="text-gray-500">Acompanhe todos os eventos, consultas, vacinas e momentos registrados pela nossa equipe.</p>
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl text-gray-500 bg-gray-50">
          Nenhum registro encontrado no histórico.
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {timelineItems.map((item) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Ícone central */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${item.colorClass}`}>
                {item.icon}
              </div>
              
              {/* Card do evento */}
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow">
                {item.media && (
                  <div className="w-full h-48 bg-gray-100 rounded-t-xl overflow-hidden relative">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media_files/${item.media.storage_path}`} 
                      alt="Mídia" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className={item.media ? "pt-4 pb-2" : "pb-2"}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      {format(item.date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                </CardHeader>
                {item.description && (
                  <CardContent className="pt-0 text-sm text-gray-600 whitespace-pre-wrap">
                    {item.description}
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
