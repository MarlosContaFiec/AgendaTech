import React, { useEffect, useState } from 'react'
import { SectionHeader } from '../../components/shared'
import {
  listBusinessRules, createBusinessRule, updateBusinessRule, deleteBusinessRule, getBusinessRuleVars,
  listCapacities, saveCapacity, deleteCapacity,
  getChatConfig, saveChatConfig, createFaq, updateFaq, deleteFaq,
  listRules, createRule, updateRule, deleteRule,
} from '../../services/company'
import { Button, Input, Select, Badge, Modal, Textarea } from '../../components/ui'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'

const TABS = ['Regras de Negócio', 'Capacidade', 'Chat / FAQ', 'Regras do Calendário']

function BusinessRulesTab() {
  const [rules, setRules] = useState([])
  const [templateVars, setTemplateVars] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ id: null, tipo: 'notificacao', descricao: '', config: '{}' })

  useEffect(() => {
    Promise.all([listBusinessRules(), getBusinessRuleVars()]).then(([rulesRes, varsRes]) => {
      setRules(Array.isArray(rulesRes?.data) ? rulesRes.data : [])
      setTemplateVars(Array.isArray(varsRes?.data) ? varsRes.data : [])
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    const payload = { ...form }
    try { payload.config = JSON.parse(form.config) } catch { payload.config = {} }
    const res = form.id ? await updateBusinessRule(form.id, payload) : await createBusinessRule(payload)
    if (res?.success) {
      setOpen(false)
      const refresh = await listBusinessRules()
      setRules(Array.isArray(refresh?.data) ? refresh.data : [])
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta regra?')) return
    await deleteBusinessRule(id)
    const refresh = await listBusinessRules()
    setRules(Array.isArray(refresh?.data) ? refresh.data : [])
  }

  if (loading) return <div className="text-center text-muted py-6">Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Regras de notificação, cancelamento, reagendamento</p>
        <Button onClick={() => { setForm({ id: null, tipo: 'notificacao', descricao: '', config: '{}' }); setOpen(true) }}>
          <FiPlus size={14} /> Nova regra
        </Button>
      </div>

      {templateVars.length > 0 && (
        <div className="rounded-xl border border-line bg-surface-alt p-3 text-xs text-muted">
          <span className="font-semibold text-foreground">Variáveis de template:</span>{' '}
          {templateVars.map((v) => typeof v === 'string' ? v : v.nome || v.variavel).join(', ')}
        </div>
      )}

      {!rules.length && <p className="text-sm text-muted">Nenhuma regra cadastrada.</p>}

      <div className="list-stack">
        {rules.map((r) => (
          <div key={r.id} className="list-item flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground font-medium">{r.descricao || `Regra #${r.id}`}</div>
              <Badge className="mt-1">{r.tipo}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setForm({ ...r, config: JSON.stringify(r.config || {}, null, 2) }); setOpen(true) }}>
                <FiEdit2 size={14} />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(r.id)}><FiTrash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? 'Editar regra' : 'Nova regra'}>
        <div className="space-y-4">
          <Select label="Tipo" value={form.tipo} onChange={(e) => setForm((s) => ({ ...s, tipo: e.target.value }))}>
            <option value="notificacao">Notificação</option>
            <option value="cancelamento">Cancelamento</option>
            <option value="reagendamento">Reagendamento</option>
            <option value="limite">Limite</option>
          </Select>
          <Input label="Descrição" value={form.descricao} onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))} />
          <Textarea label="Configuração (JSON)" value={form.config} onChange={(e) => setForm((s) => ({ ...s, config: e.target.value }))} rows={5} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function CapacityTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ faixa_horaria: '', max_agendamentos: '' })

  useEffect(() => {
    listCapacities().then((res) => {
      setItems(Array.isArray(res?.data) ? res.data : [])
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    if (!form.faixa_horaria) return
    const res = await saveCapacity({ ...form, max_agendamentos: Number(form.max_agendamentos) || 5 })
    if (res?.success) {
      setForm({ faixa_horaria: '', max_agendamentos: '' })
      const refresh = await listCapacities()
      setItems(Array.isArray(refresh?.data) ? refresh.data : [])
    }
  }

  async function handleDelete(id) {
    await deleteCapacity(id)
    const refresh = await listCapacities()
    setItems(Array.isArray(refresh?.data) ? refresh.data : [])
  }

  if (loading) return <div className="text-center text-muted py-6">Carregando...</div>

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Defina limites de agendamentos por faixa horária.</p>
      <div className="form-grid three">
        <Input label="Faixa horária" placeholder="ex: 08:00-12:00" value={form.faixa_horaria} onChange={(e) => setForm((s) => ({ ...s, faixa_horaria: e.target.value }))} />
        <Input label="Máx. agendamentos" type="number" value={form.max_agendamentos} onChange={(e) => setForm((s) => ({ ...s, max_agendamentos: e.target.value }))} />
        <Button className="self-end" onClick={handleSave}>Adicionar</Button>
      </div>
      {items.map((c) => (
        <div key={c.id} className="list-item flex items-center justify-between">
          <span className="text-foreground">{c.faixa_horaria}: máx {c.max_agendamentos}</span>
          <Button variant="ghost" onClick={() => handleDelete(c.id)}><FiTrash2 size={14} /></Button>
        </div>
      ))}
    </div>
  )
}

function ChatFaqTab() {
  const [config, setConfig] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')
  const [faqForm, setFaqForm] = useState({ id: null, pergunta: '', resposta: '' })
  const [faqOpen, setFaqOpen] = useState(false)

  useEffect(() => {
    getChatConfig().then((res) => {
      const data = res?.data || {}
      setConfig(data)
      setMensagem(data?.mensagem_abertura || '')
      setFaqs(Array.isArray(data?.faqs) ? data.faqs : [])
      setLoading(false)
    })
  }, [])

  async function saveMsg() {
    await saveChatConfig({ mensagem_abertura: mensagem })
  }

  async function handleFaq() {
    const res = faqForm.id
      ? await updateFaq(faqForm.id, faqForm)
      : await createFaq(faqForm)
    if (res?.success) {
      setFaqOpen(false)
      const refresh = await getChatConfig()
      setFaqs(Array.isArray(refresh?.data?.faqs) ? refresh.data.faqs : [])
    }
  }

  async function removeFaq(id) {
    await deleteFaq(id)
    const refresh = await getChatConfig()
    setFaqs(Array.isArray(refresh?.data?.faqs) ? refresh.data.faqs : [])
  }

  if (loading) return <div className="text-center text-muted py-6">Carregando...</div>

  return (
    <div className="space-y-4">
      <div>
        <Textarea label="Mensagem de abertura do chat" value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={3} />
        <Button className="mt-2" onClick={saveMsg}>Salvar mensagem</Button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Perguntas frequentes</span>
        <Button variant="ghost" onClick={() => { setFaqForm({ id: null, pergunta: '', resposta: '' }); setFaqOpen(true) }}>
          <FiPlus size={14} /> Nova
        </Button>
      </div>

      {faqs.map((f) => (
        <div key={f.id} className="list-item flex items-start justify-between gap-3">
          <div>
            <div className="text-foreground font-medium">{f.pergunta}</div>
            <div className="text-sm text-muted">{f.resposta}</div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" onClick={() => { setFaqForm(f); setFaqOpen(true) }}><FiEdit2 size={14} /></Button>
            <Button variant="ghost" onClick={() => removeFaq(f.id)}><FiTrash2 size={14} /></Button>
          </div>
        </div>
      ))}

      <Modal open={faqOpen} onClose={() => setFaqOpen(false)} title={faqForm.id ? 'Editar FAQ' : 'Nova FAQ'}>
        <div className="space-y-4">
          <Input label="Pergunta" value={faqForm.pergunta} onChange={(e) => setFaqForm((s) => ({ ...s, pergunta: e.target.value }))} />
          <Textarea label="Resposta" value={faqForm.resposta} onChange={(e) => setFaqForm((s) => ({ ...s, resposta: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setFaqOpen(false)}>Cancelar</Button>
            <Button onClick={handleFaq}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function CalendarRulesTab() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ id: null, tipo: 'padrao', descricao: '', config: '{}' })

  useEffect(() => {
    listRules().then((res) => {
      setRules(Array.isArray(res?.data) ? res.data : [])
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    const payload = { ...form }
    try { payload.config = JSON.parse(form.config) } catch { payload.config = {} }
    const res = form.id ? await updateRule(form.id, payload) : await createRule(payload)
    if (res?.success) {
      setOpen(false)
      const refresh = await listRules()
      setRules(Array.isArray(refresh?.data) ? refresh.data : [])
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta regra?')) return
    await deleteRule(id)
    const refresh = await listRules()
    setRules(Array.isArray(refresh?.data) ? refresh.data : [])
  }

  if (loading) return <div className="text-center text-muted py-6">Carregando...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Padrões, exceções e datas únicas para o calendário.</p>
        <Button onClick={() => { setForm({ id: null, tipo: 'padrao', descricao: '', config: '{}' }); setOpen(true) }}>
          <FiPlus size={14} /> Nova regra
        </Button>
      </div>

      {!rules.length && <p className="text-sm text-muted">Nenhuma regra de calendário.</p>}

      <div className="list-stack">
        {rules.map((r) => (
          <div key={r.id} className="list-item flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground font-medium">{r.descricao || `Regra #${r.id}`}</div>
              <Badge variant={r.tipo === 'padrao' ? 'default' : r.tipo === 'excecao' ? 'warning' : 'info'} className="mt-1">{r.tipo}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setForm({ ...r, config: JSON.stringify(r.config || {}, null, 2) }); setOpen(true) }}>
                <FiEdit2 size={14} />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(r.id)}><FiTrash2 size={14} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? 'Editar regra' : 'Nova regra'}>
        <div className="space-y-4">
          <Select label="Tipo" value={form.tipo} onChange={(e) => setForm((s) => ({ ...s, tipo: e.target.value }))}>
            <option value="padrao">Padrão (recorrente)</option>
            <option value="excecao">Exceção</option>
            <option value="unico">Único (data única)</option>
          </Select>
          <Input label="Descrição" value={form.descricao} onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))} />
          <Textarea label="Configuração (JSON)" value={form.config} onChange={(e) => setForm((s) => ({ ...s, config: e.target.value }))} rows={5} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState(0)

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Configurações" subtitle="Regras de negócio, capacidade e chat" />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} className={`tab ${tab === i ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      <div className="panel">
        {tab === 0 && <BusinessRulesTab />}
        {tab === 1 && <CapacityTab />}
        {tab === 2 && <ChatFaqTab />}
        {tab === 3 && <CalendarRulesTab />}
      </div>
    </div>
  )
}
