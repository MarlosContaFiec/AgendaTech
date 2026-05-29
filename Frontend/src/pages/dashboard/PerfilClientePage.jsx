import React, { useEffect, useState } from 'react'
import { SectionHeader, ScoreBadge } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { updateClientProfile, listDependents } from '../../services/client'
import { Button, Input } from '../../components/ui'
import ScoreRing from '../../components/ui/ScoreRing'

export default function PerfilClientePage() {
  const { data } = useCrudList('/api/cliente/perfil', {})
  const [form, setForm] = useState({})
  const score = Number(form.score || data?.score || 95.5)
  const dependentes = [
    { id: 1, nome: 'Lucas Silva', idade: 8 },
    { id: 2, nome: 'Ana Silva', idade: 5 },
  ]

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  async function handleSave() {
    await updateClientProfile({
      nome: form.nome,
      telefone: form.telefone,
      data_nascimento: form.data_nascimento,
    })
  }

  return (
    <div className="space-y-5">
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
            <Button onClick={handleSave}>Salvar perfil</Button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="font-heading text-3xl text-foreground">Dependentes</div>
            {dependentes.map((item) => (
              <div key={item.id} className="list-item flex items-center justify-between">
                <div>{item.nome}, {item.idade} anos</div>
                <Button variant="ghost">Remover</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel text-center">
          <ScoreRing score={score} />
          <div className="mt-4">
            <ScoreBadge score={score} />
          </div>
          <div className="mt-4 text-sm text-muted">Último score: +1.00</div>
        </div>
      </div>
    </div>
  )
}
