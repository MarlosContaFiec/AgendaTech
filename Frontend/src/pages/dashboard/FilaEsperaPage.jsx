import React from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { Button, Badge } from '../../components/ui'

export default function FilaEsperaPage() {
  const { items } = useCrudList('/api/fila', [])
  const queue = items?.length ? items : [{ id: 1, servico: 'Corte Simples', posicao: 2, status: 'aguardando' }]

  return (
    <div className="space-y-5">
      <SectionHeader title="Fila de espera" subtitle="Posição, conversão e cancelamento" />
      <div className="list-stack">
        {queue.map((item) => (
          <div key={item.id} className="list-item flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground">{item.servico || 'Serviço'}</div>
              <div className="text-sm text-muted">Posição {item.posicao || 1}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">{item.status}</Badge>
              <Button variant="ghost">Cancelar</Button>
              <Button variant="ghost">Converter</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
