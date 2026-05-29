import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'

export default function SucessoPage() {
  return (
    <AuthLayout title="Conta criada!" subtitle="Seu cadastro foi concluído">
      <div className="space-y-5 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[rgba(0,184,148,.12)] text-4xl text-success">✓</div>
        <p className="text-sm text-muted">Verifique seu email para ativar a conta.</p>
        <Button as={Link} to="/login" className="w-full">Ir para login</Button>
      </div>
    </AuthLayout>
  )
}
