import React, { useMemo, useState } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { createService, deleteService, listServices, updateService } from '../../services/company'
import { Button, Input, Modal, Select, Textarea, Badge } from '../../components/ui'
import { currency } from '../../utils/formatters'
import { maskCurrencyBR, onlyDigits } from '../../utils/masks'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

const defaultForm = {
  id: null,
  nome: '',
  descricao: '',
  duracao_minutos: 30,
  preco_base: '',
  aceitamento_automatico: true,
  max_por_horario: null,
  hora_inicio: '09:00',
  hora_fim: '18:00',
  intervalo_minutos: 0,
  horarios: [],
  tag_ids: [],
}

export default function ServicosPage() {
  const { loading, items, setState } = useCrudList('/api/servicos', [])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const list = useMemo(() => items || [], [items])

  function reset() {
    setForm(defaultForm)
    setOpen(false)
  }

  async function handleSave() {
    setSaving(true)
    const payload = {
      ...form,
      preco_base: Number(String(form.preco_base).replace(/[^\d]/g, '')) / 100,
      duracao_minutos: Number(form.duracao_minutos),
      max_por_horario: form.max_por_horario === '' || form.max_por_horario === null ? null : Number(form.max_por_horario),
      intervalo_minutos: Number(form.intervalo_minutos || 0),
    }
    const res = form.id ? await updateService(form.id, payload) : await createService(payload)
    setSaving(false)
    if (res?.success) {
      setState((current) => ({ ...current, data: Array.isArray(current.data) ? current.data : current.data }))
      reset()
      const refresh = await listServices()
      setState((current) => ({ ...current, loading: false, data: refresh?.data || refresh?.data?.items || refresh?.data?.rows || [] }))
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este serviço?')) return
    const res = await deleteService(id)
    if (res?.success) {
      const refresh = await listServices()
      setState((current) => ({ ...current, loading: false, data: refresh?.data || refresh?.data?.items || refresh?.data?.rows || [] }))
    }
  }

  const services = list.length ? list : [
    { id: 1, nome: 'Corte Simples', descricao: 'Corte com tesoura e máquina', duracao_minutos: 30, preco_base: 45, aceitamento_automatico: true, max_por_horario: 2, tags: ['masculino', 'adulto'] },
    { id: 2, nome: 'Barba Premium', descricao: 'Barba com acabamento detalhado', duracao_minutos: 20, preco_base: 35, aceitamento_automatico: false, max_por_horario: 1, tags: ['barba'] },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Serviços"
        subtitle="CRUD completo de serviços, horários e tags"
        actionLabel="Novo serviço"
        onAction={() => setOpen(true)}
      />

      {loading ? <div className="panel text-center text-muted">Carregando...</div> : null}

      <div className="list-stack">
        {services.map((item) => (
          <div key={item.id} className="card hover:-translate-y-0.5 transition">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-3xl text-foreground">{item.nome}</div>
                <div className="text-sm text-muted">{item.descricao}</div>
                <div className="flex flex-wrap gap-2">
                  {(item.tags || []).map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-heading text-4xl text-purple">{currency(item.preco_base)}</div>
                <div className="text-sm text-muted">{item.duracao_minutos} min</div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => { setForm({ ...defaultForm, ...item, preco_base: maskCurrencyBR(String(Math.round(Number(item.preco_base || 0) * 100))), }); setOpen(true) }}>
                    <FiEdit2 /> Editar
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(item.id)}>
                    <FiTrash2 /> Excluir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!services.length ? (
        <EmptyState title="Sem serviços" description="Cadastre o primeiro serviço para começar." icon="◌" />
      ) : null}

      <Modal open={open} onClose={reset} title={form.id ? 'Editar serviço' : 'Novo serviço'} size="max-w-3xl">
        <div className="form-grid two">
          <Input label="Nome" value={form.nome} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} />
          <Input label="Preço" value={form.preco_base} onChange={(e) => setForm((s) => ({ ...s, preco_base: maskCurrencyBR(e.target.value) }))} />
          <Input label="Duração (min)" type="number" value={form.duracao_minutos} onChange={(e) => setForm((s) => ({ ...s, duracao_minutos: e.target.value }))} />
          <Select label="Aceitamento automático" value={String(form.aceitamento_automatico)} onChange={(e) => setForm((s) => ({ ...s, aceitamento_automatico: e.target.value === 'true' }))}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </Select>
          <Input label="Máx. por horário" type="number" value={form.max_por_horario ?? ''} onChange={(e) => setForm((s) => ({ ...s, max_por_horario: e.target.value }))} />
          <Input label="Intervalo (min)" type="number" value={form.intervalo_minutos} onChange={(e) => setForm((s) => ({ ...s, intervalo_minutos: e.target.value }))} />
          <Input label="Hora início" type="time" value={form.hora_inicio} onChange={(e) => setForm((s) => ({ ...s, hora_inicio: e.target.value }))} />
          <Input label="Hora fim" type="time" value={form.hora_fim} onChange={(e) => setForm((s) => ({ ...s, hora_fim: e.target.value }))} />
          <div className="md:col-span-2">
            <Textarea label="Descrição" value={form.descricao} onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={reset}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </Modal>
    </div>
  )
}
