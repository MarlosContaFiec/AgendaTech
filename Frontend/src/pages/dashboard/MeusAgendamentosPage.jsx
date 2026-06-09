import React, { useCallback, useState } from 'react'
import { SectionHeader, ModalAvaliacao, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { cancelAppointment, createEvaluation, listClientAppointments, rescheduleAppointment } from '../../services/client'
import { Button, Badge, Modal, Input } from '../../components/ui'
import { dateBR, timeBR, currency } from '../../utils/formatters'
import { statusVariant } from './helpers'
import { FiX, FiCalendar, FiStar } from 'react-icons/fi'

const tabs = [
  { label: 'Todos', value: '' },
  { label: 'Confirmados', value: 'confirmado' },
  { label: 'Pendentes', value: 'pendente' },
  { label: 'Concluídos', value: 'concluido' },
  { label: 'Cancelados', value: 'cancelado' },
]

export default function MeusAgendamentosPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const { loading, items, setState } = useCrudList(`/api/agendamentos/cliente${statusFilter ? `?status=${statusFilter}` : ''}`, [])
  const appointments = items || []

  const [openEval, setOpenEval] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleForm, setRescheduleForm] = useState({ data_agendamento: '', hora_inicio: '' })
  const [actionLoading, setActionLoading] = useState(null)

  const refresh = useCallback(async () => {
    const res = await listClientAppointments(statusFilter)
    setState((c) => ({ ...c, loading: false, data: res?.data || [] }))
  }, [statusFilter, setState])

  async function handleCancel(id) {
    if (!confirm('Cancelar este agendamento?')) return
    setActionLoading(id)
    const res = await cancelAppointment(id, 'Cancelado pelo cliente')
    setActionLoading(null)
    if (res?.success) refresh()
  }

  async function handleReschedule() {
    if (!currentId || !rescheduleForm.data_agendamento) return
    setActionLoading(currentId)
    const res = await rescheduleAppointment(currentId, rescheduleForm)
    setActionLoading(null)
    setRescheduleOpen(false)
    if (res?.success) refresh()
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Meus agendamentos" subtitle="Histórico, cancelamento e avaliação" />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`tab ${statusFilter === tab.value ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div className="panel text-center text-muted py-8">Carregando...</div>}

      {!loading && !appointments.length && (
        <EmptyState title="Nenhum agendamento" description="Seus agendamentos aparecerão aqui." icon="📅" />
      )}

      <div className="list-stack">
        {appointments.map((item) => (
          <div key={item.id} className="list-item">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  📅 {dateBR(item.data_agendamento)} {timeBR(item.hora_inicio)} - {timeBR(item.hora_fim)}
                </div>
                <div className="text-sm text-muted">{item.empresa_nome}</div>
                <div className="text-sm text-muted">{item.servico_nome} · {currency(item.valor)}</div>
                <Badge variant={statusVariant(item.status_agendamento)}>{item.status_agendamento}</Badge>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {['pendente', 'confirmado'].includes(item.status_agendamento) && (
                  <>
                    <Button variant="ghost" onClick={() => handleCancel(item.id)} disabled={actionLoading === item.id}>
                      <FiX size={14} /> Cancelar
                    </Button>
                    <Button variant="ghost" onClick={() => { setCurrentId(item.id); setRescheduleOpen(true) }}>
                      <FiCalendar size={14} /> Reagendar
                    </Button>
                  </>
                )}
                {item.status_agendamento === 'concluido' && (
                  <Button onClick={() => { setCurrentId(item.id); setOpenEval(true) }}>
                    <FiStar size={14} /> Avaliar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ModalAvaliacao
        open={openEval}
        onClose={() => setOpenEval(false)}
        onSubmit={async (payload) => {
          if (currentId) await createEvaluation(currentId, payload)
          setOpenEval(false)
          refresh()
        }}
      />

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reagendar">
        <div className="space-y-4">
          <Input label="Nova data" type="date" value={rescheduleForm.data_agendamento} onChange={(e) => setRescheduleForm((s) => ({ ...s, data_agendamento: e.target.value }))} />
          <Input label="Nova hora" type="time" value={rescheduleForm.hora_inicio} onChange={(e) => setRescheduleForm((s) => ({ ...s, hora_inicio: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>Cancelar</Button>
            <Button onClick={handleReschedule} disabled={actionLoading != null}>
              {actionLoading != null ? 'Salvando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
