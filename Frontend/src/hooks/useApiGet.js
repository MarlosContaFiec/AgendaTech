import { useEffect, useState } from 'react'
import { api } from '../services/api'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 segundo

export function useApiGet(path, fallback = null, deps = []) {
  const [state, setState] = useState({ loading: true, data: fallback, error: '' })

  useEffect(() => {
    let active = true
    let retryCount = 0

    async function fetchData() {
      try {
        setState((current) => ({ ...current, loading: true, error: '' }))
        const res = await api(path)

        if (!active) return

        // Sucesso na requisição
        if (res?.success === false) {
          setState({ loading: false, data: fallback, error: res?.message || 'Erro ao carregar' })
          return
        }

        const data = res?.data ?? fallback
        setState({ loading: false, data, error: '' })
      } catch (err) {
        // Erro de rede ou parsing — tenta novamente
        if (!active) return

        retryCount++
        if (retryCount < MAX_RETRIES) {
          setTimeout(fetchData, RETRY_DELAY)
        } else {
          setState({ 
            loading: false, 
            data: fallback, 
            error: 'Falha ao carregar. Verifique sua conexão.' 
          })
        }
      }
    }

    fetchData()

    return () => { active = false }
  }, [path, ...deps])

  return [state, setState]
}