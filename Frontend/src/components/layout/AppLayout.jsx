import React, { useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FiBell, FiChevronLeft, FiLogOut, FiMenu, FiHelpCircle } from 'react-icons/fi'
import Logo from '../shared/Logo'
import ChatBot from '../shared/ChatBot'
import HelpButton from '../shared/HelpButton'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import { firstLetter } from '../../utils/formatters'

const menuByType = {
  empresa: [
    { to: '/dashboard/visao-geral', label: 'Visão Geral', icon: '📊' },
    { to: '/dashboard/servicos', label: 'Serviços', icon: '✦' },
    { to: '/dashboard/tags', label: 'Tags', icon: '🏷' },
    { to: '/dashboard/agendamentos', label: 'Agendamentos', icon: '📅' },
    { to: '/dashboard/solicitacoes', label: 'Solicitações', icon: '📋' },
    { to: '/dashboard/calendario', label: 'Calendário', icon: '📆' },
    { to: '/dashboard/mensagens', label: 'Mensagens', icon: '💬' },
    { to: '/dashboard/configuracoes', label: 'Configurações', icon: '⚙' },
    { to: '/dashboard/notificacoes', label: 'Notificações', icon: '🔔' },
    { to: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
    { to: '/dashboard/perfil-publico', label: 'Perfil Público', icon: '🌐' },
  ],
  cliente: [
    { to: '/dashboard/explorar', label: 'Explorar', icon: '🔍' },
    { to: '/dashboard/meus-agendamentos', label: 'Meus Agendamentos', icon: '📅' },
    { to: '/dashboard/calendario', label: 'Calendário', icon: '📆' },
    { to: '/dashboard/dependentes', label: 'Dependentes', icon: '👥' },
    { to: '/dashboard/documentos', label: 'Documentos', icon: '📄' },
    { to: '/dashboard/fila', label: 'Fila de Espera', icon: '⏳' },
    { to: '/dashboard/notificacoes', label: 'Notificações', icon: '🔔' },
    { to: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
  ],
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menu = menuByType[user?.tipo] || menuByType.cliente

  const currentLabel = useMemo(() => {
    const match = menu.find((item) => location.pathname.startsWith(item.to))
    return match?.label || 'Dashboard'
  }, [menu, location.pathname])

  const displayName = user?.nome || user?.nome_fantasia || user?.email || 'Usuário'

  return (
    <div className="app-shell">
      {mobileOpen && <div className="sidebar-overlay md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`${mobileOpen ? 'sidebar sidebar-mobile' : 'sidebar hidden md:flex'}`}>
        <div className="sidebar-brand">
          <Logo compact />
          <button className="ml-auto rounded-full p-2 text-muted hover:bg-surface-alt md:hidden" onClick={() => setMobileOpen(false)}>
            <FiChevronLeft />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom mt-4">
          <button className="sidebar-link w-full text-danger hover:bg-[rgba(255,107,107,.1)] hover:text-danger" onClick={logout}>
            <FiLogOut />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="page">
        <header className="header">
          <div className="flex items-center gap-3">
            <button className="mobile-menu-btn rounded-full p-2 text-muted hover:bg-surface-alt" onClick={() => setMobileOpen(true)}>
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className="font-heading text-3xl text-foreground">{currentLabel}</h2>
              <p className="text-xs text-muted">AgendaTech</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/dashboard/notificacoes" className="relative rounded-full p-2 text-muted hover:bg-surface-alt transition">
              <FiBell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
            </NavLink>
            <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-3 py-2">
              <div className="avatar h-8 w-8 text-sm">{firstLetter(displayName)}</div>
              <div className="hidden md:block">
                <div className="text-xs font-medium text-foreground">{displayName}</div>
                <div className="text-[11px] text-muted capitalize">{user?.tipo || 'usuário'}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="page-inner">
          <Outlet />
        </main>
      </div>

      <HelpButton currentPage={currentLabel} userType={user?.tipo} />
      <ChatBot empresaId={user?.tipo === 'empresa' ? user?.id : null} />
    </div>
  )
}
