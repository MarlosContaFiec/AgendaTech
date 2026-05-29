import React, { useState } from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { createDependent, deleteDependent, updateDependent, listDependents } from '../../services/client'
import { Button, Input, Modal } from '../../components/ui'

const initial = { id: null, nome: '', idade: '' }

export default function DependentesPage() {
  const { items } = useCrudList('/api/cliente/dependentes', [])
  const dependentes = items?.length ? items : [{ id: 1, nome: 'Lucas Silva', idade: 8 }, { id: 2, nome: 'Ana Silva', idade: 5 }]
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initial)

  return (
    <div className="space-y-5">
      <SectionHeader title="Dependentes" subtitle="CRUD completo" actionLabel="Novo dependente" onAction={() => setOpen(true)} />
      <div className="list-stack">
        {dependentes.map((item) => (
          <div key={item.id} className="list-item flex items-center justify-between gap-4">
            <div className="text-foreground">{item.nome} • {item.idade} anos</div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setForm(item); setOpen(true) }}>Editar</Button>
              <Button variant="ghost" onClick={() => deleteDependent(item.id)}>Remover</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setForm(initial) }} title={form.id ? 'Editar dependente' : 'Novo dependente'}>
        <div className="space-y-4">
          <Input label="Nome" value={form.nome || ''} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} />
          <Input label="Idade" type="number" value={form.idade || ''} onChange={(e) => setForm((s) => ({ ...s, idade: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(initial) }}>Cancelar</Button>
            <Button onClick={async () => {
              if (form.id) await updateDependent(form.id, form)
              else await createDependent(form)
              setOpen(false)
              setForm(initial)
              window.location.reload()
            }}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
