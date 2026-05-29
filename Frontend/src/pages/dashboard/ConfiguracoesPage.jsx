import React, { useState } from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { useApiGet } from '../../hooks/useApiGet'
import { Button, Input, Select, Textarea, Badge } from '../../components/ui'

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('regras')
  const { items: rules } = useCrudList('/api/regras-negocio', [])
  const { items: capacities } = useCrudList('/api/empresa/capacidades', [])
  const { data: chatData } = useApiGet('/api/mensagens/chat-config', { config: null, faqs: [] }, [])

  const chat = chatData || { config: null, faqs: [] }

  return (
    <div className="space-y-5">
      <SectionHeader title="Configurações" subtitle="Regras de negócio, capacidade e chat" />
      <div className="flex flex-wrap gap-2">
        <button className={`tab ${tab === 'regras' ? 'active' : ''}`} onClick={() => setTab('regras')}>Regras de Negócio</button>
        <button className={`tab ${tab === 'capacidade' ? 'active' : ''}`} onClick={() => setTab('capacidade')}>Capacidade</button>
        <button className={`tab ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>Chat / FAQ</button>
      </div>

      {tab === 'regras' ? (
        <div className="grid-cards two">
          <div className="panel">
            <h3 className="mb-4 text-3xl text-foreground">Regras de negócio</h3>
            <div className="list-stack">
              {(rules?.length ? rules : [{ id: 1, tipo: 'notificacao', nome: 'Lembrete 12h antes', antecedencia_horas: 12, ativo: 1 }]).map((item) => (
                <div key={item.id} className="list-item flex items-center justify-between gap-4">
                  <div>
                    <div className="text-foreground">{item.nome}</div>
                    <div className="text-sm text-muted">{item.tipo}</div>
                  </div>
                  <Badge variant={item.ativo ? 'success' : 'danger'}>{item.ativo ? 'ativo' : 'inativo'}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="panel space-y-4">
            <h3 className="text-3xl text-foreground">Nova regra</h3>
            <div className="form-grid two">
              <Select label="Tipo">
                <option value="notificacao">Notificação</option>
                <option value="cancelamento">Cancelamento</option>
                <option value="reagendamento">Reagendamento</option>
                <option value="capacidade">Capacidade</option>
              </Select>
              <Input label="Nome" />
              <Input label="Antecedência (h)" type="number" />
              <Input label="Limite (h)" type="number" />
              <Input label="Taxa %" type="number" />
              <Input label="Taxa fixa" type="number" />
              <Textarea label="Template" className="md:col-span-2" />
            </div>
            <Button>Salvar regra</Button>
          </div>
        </div>
      ) : null}

      {tab === 'capacidade' ? (
        <div className="panel">
          <div className="list-stack">
            {(capacities?.length ? capacities : [{ id: 1, hora_inicio: '09:00:00', hora_fim: '12:00:00', max_agendamentos: 5 }]).map((item) => (
              <div key={item.id} className="list-item flex items-center justify-between gap-4">
                <div className="text-foreground">{String(item.hora_inicio).slice(0, 5)} - {String(item.hora_fim).slice(0, 5)}</div>
                <Badge variant="info">{item.max_agendamentos}</Badge>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'chat' ? (
        <div className="grid-cards two">
          <div className="panel space-y-4">
            <h3 className="text-3xl text-foreground">Config chat</h3>
            <Input label="Mensagem de abertura" defaultValue={chat?.config?.mensagem_abertura || ''} />
            <Button>Salvar chat</Button>
          </div>
          <div className="panel space-y-4">
            <h3 className="text-3xl text-foreground">FAQ</h3>
            <div className="list-stack">
              {(chat?.faqs?.length ? chat.faqs : [{ id: 1, pergunta: 'Horário?', resposta: 'Seg a sáb, 9h às 18h.' }]).map((item) => (
                <div key={item.id} className="list-item">
                  <div className="text-foreground">{item.pergunta}</div>
                  <div className="text-sm text-muted">{item.resposta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
