import React, { useMemo, useState } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { getCompanies, getCities, getFeaturedCompanies, getNiches } from '../../services/public'
import { Button, Input, Select, Badge } from '../../components/ui'
import { currency } from '../../utils/formatters'

export default function ExplorarPage() {
  const [busca, setBusca] = useState('')
  const [nicho, setNicho] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const { items: featured } = useCrudList('/api/empresas/destaques', [])
  const { items: niches } = useCrudList('/api/empresas/nichos', [])
  const { items: cities } = useCrudList('/api/empresas/cidades', [])
  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (nicho) params.set('nicho', nicho)
    if (cidade) params.set('cidade', cidade)
    if (estado) params.set('estado', estado)
    params.set('pagina', '1')
    params.set('limite', '20')
    return `?${params.toString()}`
  }, [busca, nicho, cidade, estado])

  const { items: companies } = useCrudList(`/api/empresas${query}`, [])

  const results = companies?.length ? companies : [
    { id: 1, nome_fantasia: 'Barbearia Estilo', nicho: 'beleza', sub_nicho: 'barbearia', cidade: 'Indaiatuba', estado: 'SP', media_avaliacao: 4.8, agendamentos_24h: 12 },
    { id: 2, nome_fantasia: 'Studio Glam', nicho: 'beleza', sub_nicho: 'salao', cidade: 'Campinas', estado: 'SP', media_avaliacao: 4.9, agendamentos_24h: 8 },
    { id: 3, nome_fantasia: 'Ateliê Zen', nicho: 'bem-estar', sub_nicho: 'massagem', cidade: 'Indaiatuba', estado: 'SP', media_avaliacao: 4.7, agendamentos_24h: 5 },
  ]

  return (
    <div className="space-y-5">
      <SectionHeader title="Explorar" subtitle="Busque empresas, nichos e cidades" />
      <div className="panel space-y-4">
        <Input label="Busca" placeholder="Empresa, serviço..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="form-grid three">
          <Select label="Nicho" value={nicho} onChange={(e) => setNicho(e.target.value)}>
            <option value="">Todos</option>
            {(niches || []).map((item) => <option key={`${item.nicho}-${item.sub_nicho}`} value={item.nicho}>{item.nicho} / {item.sub_nicho}</option>)}
          </Select>
          <Select label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
            <option value="">Todas</option>
            {(cities || []).map((item) => <option key={`${item.cidade}-${item.estado}`} value={item.cidade}>{item.cidade} / {item.estado}</option>)}
          </Select>
          <Button className="self-end">Buscar</Button>
        </div>
      </div>

      <div className="grid-cards three">
        {(featured?.length ? featured : results.slice(0, 3)).map((item) => (
          <div key={item.id} className="card hover:-translate-y-0.5 transition">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-[14px] bg-brand text-xl font-bold text-white">
              {String(item.nome_fantasia || item.nome || 'A').charAt(0)}
            </div>
            <div className="text-center">
              <div className="font-heading text-4xl text-foreground">{item.nome_fantasia || item.nome}</div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Badge>{item.nicho || 'nicho'}</Badge>
                <Badge variant="info">{item.cidade || 'cidade'}</Badge>
              </div>
              <div className="mt-3 text-sm text-muted">★ {Number(item.media_avaliacao || 0).toFixed(1)} · {item.agendamentos_24h || item.total_agendamentos_mes || 0} agendamentos</div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h3 className="mb-4 text-3xl text-foreground">Resultados</h3>
        <div className="list-stack">
          {results.map((item) => (
            <div key={item.id} className="list-item flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-foreground">{item.nome_fantasia}</div>
                <div className="text-sm text-muted">{item.nicho} · {item.sub_nicho} · {item.cidade} / {item.estado}</div>
              </div>
              <div className="text-right text-sm text-muted">★ {Number(item.media_avaliacao || 0).toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
