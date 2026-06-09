import React, { useEffect, useState } from 'react'
import { SectionHeader, ScoreBadge, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { updateClientProfile, listDependents, createDependent, deleteDependent } from '../../services/client'
import { Button, Input, Modal } from '../../components/ui'
import ScoreRing from '../../components/ui/ScoreRing'

export default function PerfilClientePage() {
  const { data } = useCrudList('/api/cliente/perfil', {})
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [deps, setDeps] = useState([])
  const [depOpen, setDepOpen] = useState(false)
  const [depForm, setDepForm] = useState({ nome: '', idade: '' })

  const score = Number(form.score || data?.score || 0)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  useEffect(() => {
    listDependents().then((res) => {
      const d = res?.data || []
      setDeps(Array.isArray(d) ? d : d?.items || [])
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await updateClientProfile({
      nome: form.nome,
      telefone: form.telefone,
      data_nascimento: form.data_nascimento,
    })
    setSaving(false)
  }

  async function handleAddDep() {
    if (!depForm.nome.trim()) return
    const res = await createDependent({ nome: depForm.nome, idade: Number(depForm.idade) || 0 })
    if (res?.success) {
      setDepOpen(false)
      setDepForm({ nome: '', idade: '' })
      const refresh = await listDependents()
      setDeps(Array.isArray(refresh?.data) ? refresh.data : [])
    }
  }

  async function handleRemoveDep(id) {
    if (!confirm('Remover dependente?')) return
    await deleteDependent(id)
    const refresh = await listDependents()
    setDeps(Array.isArray(refresh?.data) ? refresh.data : [])
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Meu perfil" subtitle="Dados pessoais, dependentes e score" />
      <div className="grid-cards two">
        <div className="panel space-y-3">
          <div className="form-grid two">
            <Input label="Nome" value={form.nome || ''} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} />
            <Input label="Telefone" value={form.telefone || ''} onChange={(e) => setForm((s) => ({ ...s, telefone: e.target.value }))} />
            <Input label="Nascimento" type="date" value={form.data_nascimento || ''} onChange={(e) => setForm((s) => ({ ...s, data_nascimento: e.target.value }))} />
            <Input label="Email" value={form.email || ''} disabled />
            <Input label="CPF" value={form.cpf || ''} disabled />
            <Input label="Score" value={String(form.score ?? '')} disabled />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar perfil'}</Button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-heading text-3xl text-foreground">Dependentes</div>
              <Button variant="ghost" onClick={() => setDepOpen(true)}>+ Adicionar</Button>
            </div>
            {deps.length === 0 && <p className="text-sm text-muted">Nenhum dependente cadastrado.</p>}
            {deps.map((item) => (
              <div key={item.id} className="list-item flex items-center justify-between">
                <div className="text-foreground">{item.nome}, {item.idade} anos</div>
                <Button variant="ghost" onClick={() => handleRemoveDep(item.id)}>Remover</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel text-center">
          <ScoreRing score={score} />
          <div className="mt-4">
            <ScoreBadge score={score} />
          </div>
          <div className="mt-4 text-sm text-muted">Último score: {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}</div>
        </div>
      </div>

      <Modal open={depOpen} onClose={() => setDepOpen(false)} title="Adicionar dependente">
        <div className="space-y-4">
          <Input label="Nome" value={depForm.nome} onChange={(e) => setDepForm((s) => ({ ...s, nome: e.target.value }))} />
          <Input label="Idade" type="number" value={depForm.idade} onChange={(e) => setDepForm((s) => ({ ...s, idade: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDepOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddDep}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
