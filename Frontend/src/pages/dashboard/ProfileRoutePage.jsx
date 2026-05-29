import React from 'react'
import { useAuth } from '../../context/AuthContext'
import PerfilEmpresaPage from './PerfilEmpresaPage'
import PerfilClientePage from './PerfilClientePage'
import { EmptyState } from '../../components/shared'

export default function ProfileRoutePage() {
  const { user } = useAuth()
  if (user?.tipo === 'empresa') return <PerfilEmpresaPage />
  if (user?.tipo === 'cliente') return <PerfilClientePage />
  return <EmptyState title="Perfil indisponível" description="Não foi possível detectar o tipo da conta." icon="◌" />
}
