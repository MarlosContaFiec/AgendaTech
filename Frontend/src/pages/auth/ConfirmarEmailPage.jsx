import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import { verifyTokenRequest } from '../../services/auth'

export default function ConfirmarEmailPage() {
  const { token } = useParams()
  const [state, setState] = useState({ loading: true, success: false, message: '' })

  useEffect(() => {
    let active = true
    ;(async () => {
      const res = await verifyTokenRequest(token)
      if (!active) return
      setState({
        loading: false,
        success: Boolean(res?.success),
        message: res?.message || 'Processado',
      })
    })()
    return () => { active = false }
  }, [token])

  return (
    <AuthLayout title={state.loading ? 'Verificando...' : state.success ? 'Email verificado' : 'Falha na verificação'}>
      <div className="space-y-5 text-center">
        {state.loading ? <Spinner size={36} /> : <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl ${state.success ? 'bg-[rgba(0,184,148,.12)] text-success' : 'bg-[rgba(255,107,107,.12)] text-danger'}`}>{state.success ? '✓' : '!'}</div>}
        <p className="text-sm text-muted">{state.message}</p>
        {state.success ? <Button as={Link} to="/login" className="w-full">Ir para login</Button> : <Button as={Link} to="/login/verificar" className="w-full">Reenviar verificação</Button>}
      </div>
    </AuthLayout>
  )
}
