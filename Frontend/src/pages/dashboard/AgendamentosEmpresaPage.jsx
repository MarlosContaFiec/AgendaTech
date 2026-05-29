import React from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { acceptAppointment, refuseAppointment, concludeAppointment } from '../../services/company'
import { Button, Input, Select, Badge } from '../../components/ui'
import { dateBR, timeBR, currency } from '../../utils/formatters'
import { FiCheck, FiX, FiRepeat } from 'react-icons/fi'
import { statusVariant } from './helpers'

export default function AgendamentosEmpresaPage() {
  const { loading, items } = useCrudList('/api/agendamentos/empresa', [])
  const appointments = items?.length ? items : [
    { id: 1, data_agendamento: '2025-06-10', hora_inicio: '10:00:00', hora_fim: '10:30:00', cliente_nome: 'João Silva', servico_nome: 'Corte Simples', valor: 45, status_agendamento: 'confirmado', notas: 'Quero degradê' },
    { id: 2, data_agendamento: '2025-06-10', hora_inicio: '11:00:00', hora_fim: '11:20:00', cliente_nome: 'Maria Santos', servico_nome: 'Barba Premium', valor: 35, status_agendamento: 'pendente', notas: '' },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader title="Agendamentos" subtitle="Aceitar, recusar ou concluir" />
      <div className="panel">
        <div className="form-grid four">
          <Select label="Status">
            <option>Todos</option>
            <option>Pendente</option>
            <option>Confirmado</option>
            <option>Concluído</option>
            <option>Cancelado</option>
          </Select>
          <Input label="Data início" type="date" />
          <Input label="Data fim" type="date" />
          <Button className="self-end">Filtrar</Button>
        </div>
      </div>

      <div className="list-stack">
        {appointments.map((item) => (
          <div key={item.id} className="list-item">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-foreground">
                  <span>📅</span> {dateBR(item.data_agendamento)} {timeBR(item.hora_inicio)} - {timeBR(item.hora_fim)}
                </div>
                <div className="text-sm text-muted">Cliente: {item.cliente_nome}</div>
                <div className="text-sm text-muted">Serviço: {item.servico_nome} · {currency(item.valor)}</div>
                {item.notas ? <div className="text-sm text-muted">Notas: {item.notas}</div> : null}
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge variant={statusVariant(item.status_agendamento)}>{item.status_agendamento}</Badge>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="ghost"><FiCheck /> Aceitar</Button>
                  <Button variant="ghost"><FiX /> Recusar</Button>
                  <Button variant="ghost"><FiRepeat /> Reagendar</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
