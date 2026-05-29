import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApiGet } from '../../hooks/useApiGet'
import { normalizeData } from './helpers'
import { SectionHeader, EmptyState } from '../../components/shared'
import { currency, dateTimeBR } from '../../utils/formatters'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

export default function VisaoGeralPage() {
  const { user } = useAuth()
  const [state] = useApiGet('/api/empresa/dashboard', {
    total_clientes: 0,
    total_agendamentos: 0,
    concluidos: 0,
    cancelados: 0,
    pendentes: 0,
    media_avaliacao: 0,
    receita_total: 0,
    por_servico: [],
    ultimos: [],
  })

  if (user?.tipo !== 'empresa') {
    return <EmptyState title="Área exclusiva da empresa" description="Troque para uma conta de empresa para ver este painel." icon="⌂" />
  }

  const data = normalizeData(state, {})

  const metrics = [
    { label: 'Clientes', value: data.total_clientes ?? 0 },
    { label: 'Agendamentos', value: data.total_agendamentos ?? 0 },
    { label: 'Avaliação', value: Number(data.media_avaliacao || 0).toFixed(1) },
    { label: 'Receita', value: currency(data.receita_total || 0) },
  ]

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Visão Geral" subtitle="Resumo operacional da empresa" />
      {state.loading ? <div className="panel flex justify-center py-10"><Spinner size={30} /></div> : null}

      <div className="kpi-row">
        {metrics.map((item) => (
          <div key={item.label} className="stat">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-cards two">
        <div className="panel">
          <h3 className="mb-4 text-3xl text-foreground">Últimos agendamentos</h3>
          <div className="list-stack">
            {(data.ultimos || []).slice(0, 8).map((item) => (
              <div key={item.id} className="list-item flex items-center justify-between gap-4">
                <div>
                  <div className="text-foreground">{item.cliente_nome} · {item.servico_nome}</div>
                  <div className="text-sm text-muted">{dateTimeBR(`${item.data_agendamento}T${item.hora_inicio}`)}</div>
                </div>
                <Badge variant={item.status_agendamento === 'concluido' ? 'success' : item.status_agendamento === 'cancelado' ? 'danger' : 'warning'}>{item.status_agendamento}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3 className="mb-4 text-3xl text-foreground">Receita por serviço</h3>
          <div className="list-stack">
            {(data.por_servico || []).slice(0, 8).map((item) => (
              <div key={item.nome} className="list-item">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-foreground">{item.nome}</div>
                  <div className="text-sm text-muted">{item.total}</div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-surface-alt">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.min(100, Number(item.total || 0) * 5)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
