import { useMemo, useState } from 'react'
import { useApiGet } from './useApiGet'

export function useCrudList(path, fallback = []) {
  const [state, setState] = useApiGet(path, fallback, [path])
  const items = useMemo(() => Array.isArray(state.data) ? state.data : state.data?.items || state.data?.rows || fallback, [state.data, fallback])
  return { ...state, items, setState }
}
