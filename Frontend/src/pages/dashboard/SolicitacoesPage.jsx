import React from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { answerRequest } from '../../services/company'
import { Button, Badge } from '../../components/ui'
import { statusVariant } from './helpers'

export default function SolicitacoesPage() {
  const { items } = useCrudList('/api/solicitacoes/pendentes', [])
  const requests = items?.length ? items : [{ id: 1, minutos_extra: 30, motivo: 'Cabelo longo', status: 'pendente', cliente_nome: 'João Silva', servico_nome: 'Corte Simples' }]

  return (
    <div className="space-y-5">
      <SectionHeader title="Solicitações" subtitle="Pedidos de horário estendido" />
      <div className="list-stack">
        {requests.map((item) => (
          <div key={item.id} className="list-item flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-foreground">{item.cliente_nome || 'Cliente'} · {item.servico_nome || 'Serviço'}</div>
              <div className="text-sm text-muted">{item.motivo || 'Sem motivo'} · +{item.minutos_extra} min</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
              <Button variant="ghost" onClick={async () => { await answerRequest(item.id, { status: 'aceito', resposta_empresa: 'Ok' }); window.location.reload() }}>Aceitar</Button>
              <Button variant="ghost" onClick={async () => { await answerRequest(item.id, { status: 'negado', resposta_empresa: 'Sem disponibilidade' }); window.location.reload() }}>Negar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
