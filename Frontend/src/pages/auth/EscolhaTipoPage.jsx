import React from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiBriefcase } from 'react-icons/fi'
import AuthLayout from '../../components/layout/AuthLayout'

function ChoiceCard({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="card hover:-translate-y-0.5">
      <Icon className="mx-auto mb-3 text-4xl text-purple" />
      <div className="font-heading text-4xl text-foreground">{title}</div>
      <p className="mt-2 text-sm text-muted">{desc}</p>
    </Link>
  )
}

export default function EscolhaTipoPage() {
  return (
    <AuthLayout title="Como deseja se cadastrar?" subtitle="Escolha o tipo de conta">
      <div className="grid-cards two">
        <ChoiceCard to="/login/cadastro/cliente" icon={FiUser} title="Cliente" desc="Agende serviços, acompanhe score e dependentes." />
        <ChoiceCard to="/login/cadastro/empresa" icon={FiBriefcase} title="Empresa" desc="Gerencie serviços, horários, regras e agenda." />
      </div>
      <div className="mt-6 text-center text-sm text-muted">
        Já tem conta? <Link className="text-purple hover:underline" to="/login">Fazer login</Link>
      </div>
    </AuthLayout>
  )
}
