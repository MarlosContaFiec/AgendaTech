import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function HomeRedirectPage() {
  const { user } = useAuth()
  return <Navigate to={user?.tipo === 'empresa' ? '/dashboard/visao-geral' : '/dashboard/explorar'} replace />
}
