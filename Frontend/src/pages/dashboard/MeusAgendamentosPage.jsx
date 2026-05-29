import React, { useState } from 'react'
import { SectionHeader, ModalAvaliacao } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { cancelAppointment, createEvaluation, listClientAppointments, rescheduleAppointment } from '../../services/client'
import { Button, Badge, Modal, Input } from '../../components/ui'
import { dateBR, timeBR, currency } from '../../utils/formatters'
import { statusVariant } from './helpers'

export default function MeusAgendamentosPage() {
  const { items } = useCrudList('/api/agendamentos/cliente', [])
  const appointments = items?.length ? items : [
    { id: 1, data_agendamento: '2025-06-15', hora_inicio: '10:00:00', hora_fim: '10:30:00', empresa_nome: 'Barbearia Estilo', servico_nome: 'Corte Simples', valor: 45, status_agendamento: 'confirmado' },
    { id: 2, data_agendamento: '2025-06-10', hora_inicio: '10:00:00', hora_fim: '10:30:00', empresa_nome: 'Barbearia Estilo', servico_nome: 'Corte Simples', valor: 45, status_agendamento: 'concluido' },
  ]

  const [openEval, setOpenEval] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [rescheduleForm, setRescheduleForm] = useState({ data_agendamento: '', hora_inicio: '' })

  return (
    <div className="space-y-5">
      <SectionHeader title="Meus agendamentos" subtitle="Histórico, cancelamento e avaliação" />
      <div className="flex flex-wrap gap-2">
        {['Todos', 'Confirmados', 'Pendentes', 'Histórico'].map((tab) => <button key={tab} className="tab">{tab}</button>)}
      </div>

      <div className="list-stack">
        {appointments.map((item) => (
          <div key={item.id} className="list-item">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground">📅 {dateBR(item.data_agendamento)} {timeBR(item.hora_inicio)} - {timeBR(item.hora_fim)}</div>
                <div className="text-sm text-muted">{item.empresa_nome}</div>
                <div className="text-sm text-muted">{item.servico_nome} · {currency(item.valor)}</div>
                <Badge variant={statusVariant(item.status_agendamento)}>{item.status_agendamento}</Badge>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="ghost" onClick={async () => { await cancelAppointment(item.id); window.location.reload() }}>Cancelar</Button>
                <Button variant="ghost" onClick={() => { setCurrentId(item.id); setRescheduleOpen(true) }}>Reagendar</Button>
                {item.status_agendamento === 'concluido' ? <Button onClick={() => { setCurrentId(item.id); setOpenEval(true) }}>Avaliar</Button> : null}
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
        }}
      />

      <Modal open={rescheduleOpen} onClose={() => setRescheduleOpen(false)} title="Reagendar">
        <div className="space-y-4">
          <Input label="Nova data" type="date" value={rescheduleForm.data_agendamento} onChange={(e) => setRescheduleForm((s) => ({ ...s, data_agendamento: e.target.value }))} />
          <Input label="Nova hora" type="time" value={rescheduleForm.hora_inicio} onChange={(e) => setRescheduleForm((s) => ({ ...s, hora_inicio: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRescheduleOpen(false)}>Cancelar</Button>
            <Button onClick={async () => { if (currentId) await rescheduleAppointment(currentId, rescheduleForm); setRescheduleOpen(false); window.location.reload() }}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
