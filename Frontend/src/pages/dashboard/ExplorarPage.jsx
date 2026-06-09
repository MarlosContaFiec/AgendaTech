import React, { useEffect, useMemo, useState } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { getFeaturedCompanies, getCompanies, getNiches, getCities } from '../../services/public'
import { Button, Input, Select, Badge, Spinner } from '../../components/ui'
import { FiSearch, FiFilter, FiStar, FiMapPin } from 'react-icons/fi'

function CompanyCard({ company }) {
  return (
    <div className="card group transition hover:-translate-y-1 hover:border-purple/40">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple to-cyan text-lg font-heading text-white">
          {(company.nome_fantasia || 'E').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">{company.nome_fantasia || 'Empresa'}</h3>
          {company.descricao && <p className="mt-1 text-sm text-muted line-clamp-2">{company.descricao}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {company.nicho && <Badge>{company.nicho}</Badge>}
            {company.sub_nicho && <Badge variant="info">{company.sub_nicho}</Badge>}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            {company.cidade && (
              <span className="flex items-center gap-1"><FiMapPin size={12} /> {company.cidade}</span>
            )}
            {company.media_avaliacao > 0 && (
              <span className="flex items-center gap-1 text-yellow-400"><FiStar size={12} /> {Number(company.media_avaliacao).toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExplorarPage() {
  const [featured, setFeatured] = useState([])
  const [results, setResults] = useState([])
  const [niches, setNiches] = useState([])
  const [cities, setCities] = useState([])
  const [search, setSearch] = useState('')
  const [nicho, setNicho] = useState('')
  const [cidade, setCidade] = useState('')
  const [loading, setLoading] = useState(true)
  const [searched, setSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    Promise.all([
      getFeaturedCompanies(),
      getNiches(),
      getCities(),
    ]).then(([featRes, nichRes, cityRes]) => {
      const featData = featRes?.data || []
      setFeatured(Array.isArray(featData) ? featData : featData?.items || [])
      const nichData = nichRes?.data || []
      setNiches(Array.isArray(nichData) ? nichData : [])
      const cityData = cityRes?.data || []
      setCities(Array.isArray(cityData) ? cityData : [])
      setLoading(false)
    })
  }, [])

  async function handleSearch(e) {
    e?.preventDefault()
    setLoading(true)
    setSearched(true)
    const params = []
    if (search.trim()) params.push(`q=${encodeURIComponent(search.trim())}`)
    if (nicho) params.push(`nicho=${encodeURIComponent(nicho)}`)
    if (cidade) params.push(`cidade=${encodeURIComponent(cidade)}`)
    const query = params.length ? `?${params.join('&')}` : ''
    const res = await getCompanies(query)
    const data = res?.data || []
    setResults(Array.isArray(data) ? data : data?.items || data?.rows || [])
    setLoading(false)
  }

  const displayList = searched ? results : featured

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Explorar" subtitle="Encontre empresas e agende serviços" />

      <form onSubmit={handleSearch} className="panel">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou palavra-chave..."
              className="input w-full pl-11"
            />
          </div>
          <Button type="button" variant="ghost" onClick={() => setShowFilters((v) => !v)}>
            <FiFilter size={16} /> Filtros
          </Button>
          <Button type="submit">Buscar</Button>
        </div>
        {showFilters && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 animate-fade-up">
            <Select label="Nicho" value={nicho} onChange={(e) => setNicho(e.target.value)}>
              <option value="">Todos os nichos</option>
              {niches.map((n) => <option key={typeof n === 'string' ? n : n.nicho} value={typeof n === 'string' ? n : n.nicho}>{typeof n === 'string' ? n : n.nicho}</option>)}
            </Select>
            <Select label="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Todas as cidades</option>
              {cities.map((c) => <option key={typeof c === 'string' ? c : c.cidade} value={typeof c === 'string' ? c : c.cidade}>{typeof c === 'string' ? c : c.cidade}</option>)}
            </Select>
          </div>
        )}
      </form>

      {loading ? (
        <div className="text-center py-12"><Spinner size={32} /></div>
      ) : !displayList.length ? (
        <EmptyState
          title={searched ? 'Nenhuma empresa encontrada' : 'Nenhuma empresa em destaque'}
          description={searched ? 'Tente outros termos ou remova os filtros.' : 'As empresas com mais agendamentos aparecerão aqui.'}
          icon="🔍"
        />
      ) : (
        <>
          <div className="text-sm text-muted">
            {searched ? `${results.length} resultado${results.length !== 1 ? 's' : ''}` : 'Empresas em destaque nas últimas 24h'}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayList.map((c) => <CompanyCard key={c.id} company={c} />)}
          </div>
        </>
      )}
    </div>
  )
}
