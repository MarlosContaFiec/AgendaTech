import React, { useMemo, useState } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { createTag, deleteTag, updateTag, listTags } from '../../services/company'
import { Button, Input, Modal, Badge } from '../../components/ui'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const defaultForm = { id: null, nome: '', label: '', cor: '#6c5ce7', aceita_agendamento: true, info: '' }

export default function TagsPage() {
  const { user } = useAuth()
  const { loading, items, setState } = useCrudList('/api/tags', [])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const list = useMemo(() => items || [], [items])

  if (user?.tipo !== 'empresa') {
    return <EmptyState title="Área exclusiva da empresa" description="Troque para uma conta de empresa." icon="⌂" />
  }

  function reset() { setForm(defaultForm); setOpen(false) }

  async function handleSave() {
    setSaving(true)
    const res = form.id ? await updateTag(form.id, form) : await createTag(form)
    setSaving(false)
    if (res?.success) {
      reset()
      const refresh = await listTags()
      setState((c) => ({ ...c, loading: false, data: refresh?.data || [] }))
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta tag?')) return
    const res = await deleteTag(id)
    if (res?.success) {
      const refresh = await listTags()
      setState((c) => ({ ...c, loading: false, data: refresh?.data || [] }))
    }
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Tags" subtitle="Crie tags para categorizar dias e serviços" actionLabel="Nova tag" onAction={() => setOpen(true)} />

      {loading && <div className="panel text-center text-muted py-8">Carregando...</div>}

      {!loading && !list.length && (
        <EmptyState title="Nenhuma tag" description="Crie a primeira tag para usar no calendário e serviços." icon="🏷" />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((tag) => (
          <div key={tag.id} className="card group transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl" style={{ backgroundColor: tag.cor || '#6c5ce7' }} />
                <div>
                  <div className="text-lg font-semibold text-foreground">{tag.nome}</div>
                  {tag.label && <div className="text-xs text-muted">{tag.label}</div>}
                </div>
              </div>
              <Badge variant={tag.aceita_agendamento ? 'success' : 'danger'}>
                {tag.aceita_agendamento ? 'Aceita' : 'Fechado'}
              </Badge>
            </div>
            {tag.info && <p className="mt-3 text-sm text-muted">{tag.info}</p>}
            <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
              <Button variant="ghost" onClick={() => { setForm({ ...defaultForm, ...tag }); setOpen(true) }}>
                <FiEdit2 size={14} /> Editar
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(tag.id)}>
                <FiTrash2 size={14} /> Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={reset} title={form.id ? 'Editar tag' : 'Nova tag'}>
        <div className="space-y-4">
          <Input label="Nome" placeholder="ex: fechado, desconto, feriado" value={form.nome} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} />
          <Input label="Label (exibição)" placeholder="ex: Fechado para manutenção" value={form.label || ''} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} />
          <div className="flex items-end gap-4">
            <label className="block flex-1">
              <span className="label">Cor</span>
              <input type="color" className="h-11 w-full cursor-pointer rounded-xl border border-line-light bg-surface-alt" value={form.cor || '#6c5ce7'} onChange={(e) => setForm((s) => ({ ...s, cor: e.target.value }))} />
            </label>
            <label className="flex items-center gap-2 pb-2">
              <input type="checkbox" checked={form.aceita_agendamento ?? true} onChange={(e) => setForm((s) => ({ ...s, aceita_agendamento: e.target.checked }))} className="h-5 w-5 rounded border-line accent-purple" />
              <span className="text-sm text-foreground">Aceita agendamento</span>
            </label>
          </div>
          <Input label="Informações extras" placeholder="Detalhes visíveis ao clicar na tag" value={form.info || ''} onChange={(e) => setForm((s) => ({ ...s, info: e.target.value }))} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={reset}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nome.trim()}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
