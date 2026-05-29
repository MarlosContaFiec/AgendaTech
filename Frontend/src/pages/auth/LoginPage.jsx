import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'
import { Input, Button, Spinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { documentoMask } from '../../utils/masks'
import { validateDocumento } from '../../utils/validators'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [documento, setDocumento] = useState('')
  const [senha, setSenha] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const valid = useMemo(() => validateDocumento(documento), [documento])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const res = await login(documento.replace(/\D/g, ''), senha)
    setLoading(false)
    if (!res?.success) {
      setError(res?.message || 'Falha no login')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthLayout title="Bem-vindo" subtitle="Entre com CPF ou CNPJ e sua senha">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Documento"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          value={documento}
          onChange={(e) => setDocumento(documentoMask(e.target.value))}
          error={documento && !valid ? 'Documento inválido' : ''}
        />

        <label className="block">
          <span className="label">Senha</span>
          <div className="relative">
            <input
              className="input pr-12"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" onClick={() => setShow((v) => !v)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        {error ? <div className="rounded-[12px] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}

        <Button className="w-full" disabled={loading || !valid || !senha}>
          {loading ? <><Spinner size={18} /> Entrando...</> : 'Entrar'}
        </Button>

        <div className="auth-links">
          <Link to="/login/escolha" className="hover:text-foreground">Não tem conta? Cadastre-se</Link>
          <Link to="/login/verificar" className="hover:text-foreground">Reenviar verificação</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
