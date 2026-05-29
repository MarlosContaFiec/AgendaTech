import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest, meRequest } from '../services/auth'
import { clearSession, getSession, saveSession } from '../services/session'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bootstrapping, setBootstrapping] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const session = getSession()
      if (!session.access) {
        if (active) {
          setLoading(false)
          setBootstrapping(false)
        }
        return
      }

      try {
        const me = await meRequest(session.access)
        const data = me?.data?.data || me?.data || me?.data?.user || me?.data?.data?.user || null
        if (me?.success === false) throw new Error(me?.message || 'Sessão inválida')
        const nextUser = data?.user || data
        if (nextUser) {
          setUser(nextUser)
          saveSession({ user: nextUser })
        }
      } catch {
        try {
          const refreshed = await api('/api/auth/refresh', {
            method: 'POST',
            body: { refresh_token: session.refresh },
            auth: false,
          })
          const tokens = refreshed?.data?.tokens || refreshed?.tokens || refreshed?.data || null
          if (tokens?.access) {
            saveSession({ access: tokens.access, refresh: tokens.refresh || session.refresh })
            const me = await meRequest(tokens.access)
            const data = me?.data?.data || me?.data || me?.data?.user || me?.data?.data?.user || null
            const nextUser = data?.user || data
            if (nextUser) {
              setUser(nextUser)
              saveSession({ user: nextUser })
            }
          } else {
            clearSession()
          }
        } catch {
          clearSession()
        }
      } finally {
        if (active) {
          setLoading(false)
          setBootstrapping(false)
        }
      }
    })()
    return () => { active = false }
  }, [])

  async function login(documento, senha) {
    const response = await loginRequest(documento, senha)
    if (!response?.success) return response
    const payload = response?.data || {}
    const tokens = payload.tokens || payload
    const nextUser = payload.user || {}
    saveSession({
      access: tokens.access,
      refresh: tokens.refresh,
      user: nextUser,
    })
    setUser(nextUser)
    navigate('/dashboard', { replace: true })
    return response
  }

  function logout() {
    clearSession()
    setUser(null)
    navigate('/login', { replace: true })
  }

  async function refreshUser() {
    const session = getSession()
    if (!session.access) return null
    const response = await meRequest(session.access)
    if (response?.success && response?.data) {
      const nextUser = response.data.user || response.data
      setUser(nextUser)
      saveSession({ user: nextUser })
    }
    return response
  }

  const value = useMemo(() => ({
    user,
    loading,
    bootstrapping,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshUser,
    setUser,
  }), [user, loading, bootstrapping])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}
