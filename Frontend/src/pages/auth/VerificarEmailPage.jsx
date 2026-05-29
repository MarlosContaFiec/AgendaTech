import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Button } from '../../components/ui'
import { resendVerificationRequest } from '../../services/auth'

export default function VerificarEmailPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    const res = await resendVerificationRequest(email)
    setLoading(false)
    setMessage(res?.message || 'Verificação reenviada')
  }

  return (
    <AuthLayout title="Verifique seu email" subtitle="Enviaremos um novo link de confirmação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        {message ? <div className="rounded-[12px] border border-line bg-surface-alt px-4 py-3 text-sm text-foreground">{message}</div> : null}
        <Button className="w-full" disabled={loading}>Reenviar email</Button>
        <div className="auth-links">
          <Link to="/login" className="hover:text-foreground">Voltar ao login</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
