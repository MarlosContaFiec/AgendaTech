import React, { useEffect, useMemo, useState } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { useAuth } from '../../context/AuthContext'
import { useCrudList } from '../../hooks/useCrudList'
import { listChatConversations, getConversationMessages, sendMessageToClient } from '../../services/company'
import { Button, Input, Badge } from '../../components/ui'
import { dateTimeBR } from '../../utils/formatters'
import { FiSend, FiMessageCircle, FiArrowLeft } from 'react-icons/fi'

function ConversationList({ conversations, onSelect, selected }) {
  if (!conversations.length) {
    return <EmptyState title="Sem conversas" description="As conversas com clientes aparecerão aqui." icon="💬" />
  }
  return (
    <div className="list-stack">
      {conversations.map((c) => (
        <button
          key={c.cliente_id || c.id}
          onClick={() => onSelect(c)}
          className={`list-item w-full text-left transition ${selected?.cliente_id === c.cliente_id ? 'border-purple bg-purple/5' : ''}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-foreground font-medium">{c.cliente_nome || `Cliente #${c.cliente_id}`}</div>
              <div className="text-xs text-muted truncate max-w-[200px]">{c.ultima_mensagem || 'Sem mensagens'}</div>
            </div>
            {c.nao_lidas > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-purple px-1.5 text-xs font-bold text-white">
                {c.nao_lidas}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

function ChatView({ conversation, onBack }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!conversation?.cliente_id) return
    let active = true
    setLoading(true)
    getConversationMessages(conversation.cliente_id).then((res) => {
      if (!active) return
      const data = res?.data || []
      setMessages(Array.isArray(data) ? data : data?.items || data?.rows || [])
      setLoading(false)
    })
    return () => { active = false }
  }, [conversation?.cliente_id])

  async function handleSend() {
    if (!text.trim() || sending) return
    setSending(true)
    const res = await sendMessageToClient(conversation.cliente_id, { mensagem: text, tipo: 'chat' })
    setSending(false)
    if (res?.success) {
      setText('')
      const refresh = await getConversationMessages(conversation.cliente_id)
      const data = refresh?.data || []
      setMessages(Array.isArray(data) ? data : data?.items || data?.rows || [])
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
        <button onClick={onBack} className="btn btn-ghost p-2 md:hidden"><FiArrowLeft /></button>
        <div className="avatar h-10 w-10 text-sm">{(conversation.cliente_nome || 'C').charAt(0)}</div>
        <div>
          <div className="font-medium text-foreground">{conversation.cliente_nome || `Cliente #${conversation.cliente_id}`}</div>
          <div className="text-xs text-muted">Chat</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] max-h-[50vh] pr-2">
        {loading && <div className="text-center text-muted py-8">Carregando...</div>}
        {!loading && !messages.length && <div className="text-center text-muted py-8">Nenhuma mensagem ainda.</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.enviado_por === 'empresa' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.enviado_por === 'empresa'
                ? 'bg-purple/20 text-foreground rounded-br-md'
                : 'bg-surface-alt border border-line text-foreground rounded-bl-md'
            }`}>
              <div>{msg.mensagem}</div>
              <div className="mt-1 text-[10px] text-muted text-right">{dateTimeBR(msg.data_envio)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
        />
        <Button onClick={handleSend} disabled={sending || !text.trim()} className="shrink-0">
          <FiSend size={16} />
        </Button>
      </div>
    </div>
  )
}

export default function MensagensPage() {
  const { user } = useAuth()
  const { items } = useCrudList('/api/mensagens/conversas', [])
  const conversations = useMemo(() => items || [], [items])
  const [selected, setSelected] = useState(null)

  if (user?.tipo !== 'empresa') {
    return <EmptyState title="Mensagens" description="A caixa de mensagens está disponível para empresas." icon="💬" />
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Mensagens" subtitle="Conversas com clientes" />

      <div className="grid gap-5 md:grid-cols-[320px_1fr]">
        <div className={`panel ${selected ? 'hidden md:block' : ''}`}>
          <div className="mb-3 flex items-center gap-2 text-sm text-muted">
            <FiMessageCircle /> {conversations.length} conversa{conversations.length !== 1 ? 's' : ''}
          </div>
          <ConversationList conversations={conversations} onSelect={setSelected} selected={selected} />
        </div>

        <div className={`panel ${!selected ? 'hidden md:flex md:items-center md:justify-center' : ''}`}>
          {selected ? (
            <ChatView conversation={selected} onBack={() => setSelected(null)} />
          ) : (
            <div className="text-center text-muted py-12">
              <FiMessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <div>Selecione uma conversa</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
