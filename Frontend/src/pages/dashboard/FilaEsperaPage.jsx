import React, { useCallback } from 'react'
import { SectionHeader, EmptyState } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { sairFila, converterFila, listFila } from '../../services/client'
import { Button, Badge } from '../../components/ui'

export default function FilaEsperaPage() {
  const { loading, items, setState } = useCrudList('/api/fila', [])
  const queue = items || []

  const refresh = useCallback(async () => {
    const res = await listFila()
    setState((c) => ({ ...c, loading: false, data: res?.data || [] }))
  }, [setState])

  async function handleCancel(id) {
    if (!confirm('Sair da fila?')) return
    const res = await sairFila(id)
    if (res?.success) refresh()
  }

  async function handleConvert(id) {
    const res = await converterFila(id)
    if (res?.success) refresh()
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Fila de espera" subtitle="Posição, conversão e cancelamento" />

      {loading && <div className="panel text-center text-muted py-8">Carregando...</div>}

      {!loading && !queue.length && (
        <EmptyState title="Fila vazia" description="Quando você entrar em uma fila de espera, ela aparecerá aqui." icon="⏳" />
      )}

      <div className="list-stack">
        {queue.map((item) => (
          <div key={item.id} className="list-item flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground font-medium">{item.servico || item.servico_nome || 'Serviço'}</div>
              <div className="text-sm text-muted">Posição {item.posicao || 1}</div>
              {item.empresa_nome && <div className="text-xs text-muted">{item.empresa_nome}</div>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">{item.status || 'aguardando'}</Badge>
              <Button variant="ghost" onClick={() => handleCancel(item.id)}>Sair</Button>
              <Button variant="ghost" onClick={() => handleConvert(item.id)}>Converter</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
