import React from 'react'
import { useAuth } from '../../context/AuthContext'
import CalendarioEmpresaPage from './CalendarioEmpresaPage'
import CalendarioClientePage from './CalendarioClientePage'
import { EmptyState } from '../../components/shared'

export default function CalendarRoutePage() {
  const { user } = useAuth()
  if (user?.tipo === 'empresa') return <CalendarioEmpresaPage />
  if (user?.tipo === 'cliente') return <CalendarioClientePage />
  return <EmptyState title="Calendário indisponível" description="Não foi possível detectar o tipo da conta." icon="◌" />
}
