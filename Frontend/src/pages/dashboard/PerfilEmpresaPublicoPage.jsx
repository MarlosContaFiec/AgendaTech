import React from 'react'
import { SectionHeader } from '../../components/shared'
import { useAuth } from '../../context/AuthContext'
import { useCrudList } from '../../hooks/useCrudList'
import { getPublicCompany } from '../../services/public'
import Badge from '../../components/ui/Badge'

export default function PerfilEmpresaPublicoPage() {
  const { user } = useAuth()
  const id = user?.id
  const { data } = useCrudList(id ? `/api/empresas/${id}` : '/api/empresas/1', {})
  const company = data || {}

  return (
    <div className="space-y-5">
      <SectionHeader title="Perfil público" subtitle="Pré-visualização da empresa" />
      <div className="grid-cards two">
        <div className="panel">
          <div className="font-heading text-4xl text-foreground">{company.nome_fantasia || 'Barbearia Estilo'}</div>
          <div className="mt-2 text-sm text-muted">{company.descricao || 'Descrição pública da empresa.'}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{company.nicho || 'beleza'}</Badge>
            <Badge variant="info">{company.sub_nicho || 'barbearia'}</Badge>
          </div>
        </div>
        <div className="panel">
          <div className="text-sm text-muted">Avaliação média</div>
          <div className="font-heading text-5xl text-purple">{Number(company.media_avaliacao || 0).toFixed(1)}</div>
          <div className="mt-2 text-sm text-muted">{Number(company.total_avaliacoes || 0)} avaliações</div>
        </div>
      </div>
    </div>
  )
}
