import React from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/shared'
import Button from '../../components/ui/Button'

export default function Dashboard404Page() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="A rota solicitada não existe no dashboard."
      icon="404"
      action={<Button as={Link} to="/dashboard">Voltar</Button>}
    />
  )
}
