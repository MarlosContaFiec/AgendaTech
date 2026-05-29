import { useEffect, useState } from 'react'
import { api } from '../services/api'

export function useApiGet(path, fallback = null, deps = []) {
  const [state, setState] = useState({ loading: true, data: fallback, error: '' })

  useEffect(() => {
    let active = true
    ;(async () => {
      setState((current) => ({ ...current, loading: true, error: '' }))
      const res = await api(path)
      if (!active) return
      if (res?.success === false) {
        setState({ loading: false, data: fallback, error: res?.message || 'Erro ao carregar' })
        return
      }
      const data = res?.data ?? fallback
      setState({ loading: false, data, error: '' })
    })()
    return () => { active = false }
  }, [path, ...deps])

  return [state, setState]
}
