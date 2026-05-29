import React from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { dateTimeBR } from '../../utils/formatters'

export default function NotificacoesPage() {
  const { items } = useCrudList('/api/notificacoes', [])
  const notifications = items?.length ? items : [{ id: 1, tipo: 'lembrete', mensagem: 'Seu agendamento é amanhã às 10h', enviado_em: '2025-06-14T18:00:00.000Z', lida: 0 }]

  return (
    <div className="space-y-5">
      <SectionHeader title="Notificações" subtitle="Últimas 50 notificações" />
      <div className="list-stack">
        {notifications.map((item) => (
          <div key={item.id} className="list-item">
            <div className="flex gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${Number(item.lida) ? 'bg-transparent' : 'bg-purple'}`} />
              <div>
                <div className="text-foreground">{item.tipo}</div>
                <div className="text-sm text-muted">{item.mensagem}</div>
                <div className="mt-1 text-xs text-muted">{dateTimeBR(item.enviado_em)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
