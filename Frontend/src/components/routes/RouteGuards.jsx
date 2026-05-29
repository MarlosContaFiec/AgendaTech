import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import { useAuth } from '../../context/AuthContext'

export function PublicOnlyRoute() {
  const { loading, isAuthenticated } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner size={38} /></div>
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export function PrivateRoute() {
  const { loading, isAuthenticated } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner size={38} /></div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
