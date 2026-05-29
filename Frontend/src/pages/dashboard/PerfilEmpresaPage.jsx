import React, { useEffect, useState } from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { updateCompanyProfile } from '../../services/company'
import { Button, Input, Textarea } from '../../components/ui'
import { maskPhone, maskCEP } from '../../utils/masks'

export default function PerfilEmpresaPage() {
  const { data } = useCrudList('/api/empresa/perfil', {})
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  async function handleSave() {
    setSaving(true)
    await updateCompanyProfile(form)
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Perfil da empresa" subtitle="Dados públicos e internos" />
      <div className="grid-cards two">
        <div className="panel">
          <div className="form-grid two">
            <Input label="Nome fantasia" value={form.nome_fantasia || ''} onChange={(e) => setForm((s) => ({ ...s, nome_fantasia: e.target.value }))} />
            <Input label="Razão social" value={form.razao_social || ''} onChange={(e) => setForm((s) => ({ ...s, razao_social: e.target.value }))} />
            <Input label="CNPJ" value={form.cnpj || ''} disabled />
            <Input label="Telefone" value={maskPhone(form.telefone || '')} onChange={(e) => setForm((s) => ({ ...s, telefone: maskPhone(e.target.value) }))} />
            <Input label="CEP" value={maskCEP(form.cep || '')} onChange={(e) => setForm((s) => ({ ...s, cep: maskCEP(e.target.value) }))} />
            <Input label="Cidade" value={form.cidade || ''} onChange={(e) => setForm((s) => ({ ...s, cidade: e.target.value }))} />
            <Input label="Estado" value={form.estado || ''} onChange={(e) => setForm((s) => ({ ...s, estado: e.target.value }))} />
            <Input label="Nicho" value={form.nicho || ''} onChange={(e) => setForm((s) => ({ ...s, nicho: e.target.value }))} />
            <Input label="Sub-nicho" value={form.sub_nicho || ''} onChange={(e) => setForm((s) => ({ ...s, sub_nicho: e.target.value }))} />
            <Input label="Site" value={form.site || ''} onChange={(e) => setForm((s) => ({ ...s, site: e.target.value }))} />
            <Input label="Máx. agendamentos" type="number" value={form.max_agendamentos_global ?? ''} onChange={(e) => setForm((s) => ({ ...s, max_agendamentos_global: e.target.value }))} />
            <Textarea label="Descrição" className="md:col-span-2" value={form.descricao || ''} onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
          </div>
        </div>

        <div className="panel space-y-4">
          <div className="rounded-[16px] border border-line bg-surface-alt p-5 text-center">
            <div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-[16px] bg-brand text-4xl font-heading text-white">AT</div>
            <Button variant="ghost" className="w-full">Escolher logo</Button>
          </div>
          <div className="rounded-[16px] border border-line bg-surface-alt p-5">
            <div className="mb-2 text-xs uppercase tracking-[.08em] text-muted">Cores da marca</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-16 rounded-[12px] bg-purple" />
              <div className="h-16 rounded-[12px] bg-cyan" />
              <div className="h-16 rounded-[12px] bg-brand" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
