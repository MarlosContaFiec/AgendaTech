export function normalizeData(response, fallback = null) {
  return response?.data ?? response ?? fallback
}

export function normalizeList(response, fallback = []) {
  const data = normalizeData(response, fallback)
  if (Array.isArray(data)) return data
  return data?.items || data?.rows || data?.data || fallback
}

export function statusVariant(value = '') {
  const v = String(value).toLowerCase()
  if (['confirmado', 'concluido', 'aprovado', 'aceito'].includes(v)) return 'success'
  if (['pendente', 'aguardando'].includes(v)) return 'warning'
  if (['cancelado', 'rejeitado', 'negado'].includes(v)) return 'danger'
  return 'default'
}
