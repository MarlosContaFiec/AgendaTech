import React, { useCallback, useState } from 'react'
import { SectionHeader, EmptyState, ScoreBadge } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { listCompanyAppointments, acceptAppointment, refuseAppointment, concludeAppointment } from '../../services/company'
import { Button, Input, Select, Badge } from '../../components/ui'
import { dateBR, timeBR, currency } from '../../utils/formatters'
import { FiCheck, FiX, FiCheckCircle } from 'react-icons/fi'
import { statusVariant } from './helpers'

export default function AgendamentosEmpresaPage() {
  const [status, setStatus] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const { loading, items, setState } = useCrudList('/api/agendamentos/empresa', [])
  const [actionLoading, setActionLoading] = useState(null)

  const refresh = useCallback(async () => {
    let query = ''
    const params = []
    if (status) params.push(`status=${status}`)
    if (dataInicio) params.push(`data_inicio=${dataInicio}`)
    if (dataFim) params.push(`data_fim=${dataFim}`)
    if (params.length) query = `?${params.join('&')}`
    const res = await listCompanyAppointments(query)
    setState((c) => ({ ...c, loading: false, data: res?.data || [] }))
  }, [status, dataInicio, dataFim, setState])

  async function handleAction(action, id) {
    setActionLoading(id)
    let res
    if (action === 'accept') res = await acceptAppointment(id)
    else if (action === 'refuse') res = await refuseAppointment(id, { motivo: 'Sem disponibilidade' })
    else if (action === 'conclude') res = await concludeAppointment(id)
    setActionLoading(null)
    if (res?.success) refresh()
  }

  function handleFilter(e) {
    e.preventDefault()
    refresh()
  }

  const appointments = items || []

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Agendamentos" subtitle="Aceitar, recusar ou concluir" />
      <form className="panel" onSubmit={handleFilter}>
        <div className="form-grid four">
          <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="confirmado">Confirmado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>
          <Input label="Data início" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          <Input label="Data fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          <Button type="submit" className="self-end">Filtrar</Button>
        </div>
      </form>

      {loading && <div className="panel text-center text-muted py-8">Carregando...</div>}

      {!loading && !appointments.length && (
        <EmptyState title="Nenhum agendamento" description="Os agendamentos dos seus clientes aparecerão aqui." icon="📅" />
      )}

      <div className="list-stack">
        {appointments.map((item) => (
          <div key={item.id} className="list-item">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <span>📅</span> {dateBR(item.data_agendamento)} {timeBR(item.hora_inicio)} - {timeBR(item.hora_fim)}
                </div>
                <div className="text-sm text-muted flex items-center gap-2">
                  Cliente: {item.cliente_nome}
                  {item.cliente_score != null && <ScoreBadge score={Number(item.cliente_score)} />}
                </div>
                <div className="text-sm text-muted">Serviço: {item.servico_nome} · {currency(item.valor)}</div>
                {item.notas && <div className="text-xs text-muted italic">"{item.notas}"</div>}
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge variant={statusVariant(item.status_agendamento)}>{item.status_agendamento}</Badge>
                <div className="flex flex-wrap justify-end gap-2">
                  {item.status_agendamento === 'pendente' && (
                    <>
                      <Button variant="ghost" onClick={() => handleAction('accept', item.id)} disabled={actionLoading === item.id}>
                        <FiCheck size={14} /> Aceitar
                      </Button>
                      <Button variant="ghost" onClick={() => handleAction('refuse', item.id)} disabled={actionLoading === item.id}>
                        <FiX size={14} /> Recusar
                      </Button>
                    </>
                  )}
                  {item.status_agendamento === 'confirmado' && (
                    <Button variant="ghost" onClick={() => handleAction('conclude', item.id)} disabled={actionLoading === item.id}>
                      <FiCheckCircle size={14} /> Concluir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
