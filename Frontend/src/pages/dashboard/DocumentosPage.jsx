import React, { useState } from 'react'
import { SectionHeader } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { createDocument, deleteDocument, listDocuments, uploadSingle } from '../../services/client'
import { Button, Badge, Input, Select } from '../../components/ui'

export default function DocumentosPage() {
  const { items } = useCrudList('/api/documentos', [])
  const docs = items?.length ? items : [{ id: 1, tipo: 'rg', status: 'pendente', arquivo_url: '/uploads/demo.pdf', observacao: '' }]
  const [tipo, setTipo] = useState('rg')
  const [file, setFile] = useState(null)

  return (
    <div className="space-y-5">
      <SectionHeader title="Documentos" subtitle="Upload, status e remoção" />
      <div className="panel space-y-4">
        <div className="form-grid three">
          <Select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="rg">RG</option>
            <option value="certidao_nascimento">Certidão de nascimento</option>
            <option value="laudo_medico">Laudo médico</option>
            <option value="comprovante_residencia">Comprovante de residência</option>
            <option value="outro">Outro</option>
          </Select>
          <Input label="Arquivo" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button className="self-end" onClick={async () => {
            if (!file) return
            const uploaded = await uploadSingle(file)
            const url = uploaded?.data?.url || uploaded?.data?.data?.url
            if (url) {
              await createDocument({ tipo, arquivo_url: url })
              window.location.reload()
            }
          }}>Enviar</Button>
        </div>
      </div>

      <div className="list-stack">
        {docs.map((item) => (
          <div key={item.id} className="list-item flex items-center justify-between gap-4">
            <div>
              <div className="text-foreground">{item.tipo}</div>
              <div className="text-sm text-muted">{item.arquivo_url}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={item.status === 'aprovado' ? 'success' : item.status === 'rejeitado' ? 'danger' : 'warning'}>{item.status}</Badge>
              <Button variant="ghost" onClick={async () => { await deleteDocument(item.id); window.location.reload() }}>Remover</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
