import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { PrivateRoute, PublicOnlyRoute } from './components/routes/RouteGuards'
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import EscolhaTipoPage from './pages/auth/EscolhaTipoPage'
import CadastroPage from './pages/auth/CadastroPage'
import VerificarEmailPage from './pages/auth/VerificarEmailPage'
import SucessoPage from './pages/auth/SucessoPage'
import ConfirmarEmailPage from './pages/auth/ConfirmarEmailPage'
import HomeRedirectPage from './pages/dashboard/HomeRedirectPage'
import VisaoGeralPage from './pages/dashboard/VisaoGeralPage'
import ServicosPage from './pages/dashboard/ServicosPage'
import TagsPage from './pages/dashboard/TagsPage'
import AgendamentosEmpresaPage from './pages/dashboard/AgendamentosEmpresaPage'
import SolicitacoesPage from './pages/dashboard/SolicitacoesPage'
import CalendarRoutePage from './pages/dashboard/CalendarRoutePage'
import ConfiguracoesPage from './pages/dashboard/ConfiguracoesPage'
import NotificationsRoutePage from './pages/dashboard/NotificationsRoutePage'
import ProfileRoutePage from './pages/dashboard/ProfileRoutePage'
import PerfilEmpresaPublicoPage from './pages/dashboard/PerfilEmpresaPublicoPage'
import ExplorarPage from './pages/dashboard/ExplorarPage'
import MeusAgendamentosPage from './pages/dashboard/MeusAgendamentosPage'
import DependentesPage from './pages/dashboard/DependentesPage'
import DocumentosPage from './pages/dashboard/DocumentosPage'
import FilaEsperaPage from './pages/dashboard/FilaEsperaPage'
import MensagensPage from './pages/dashboard/MensagensPage'
import Dashboard404Page from './pages/dashboard/Dashboard404Page'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/escolha" element={<EscolhaTipoPage />} />
        <Route path="/login/cadastro/:tipo" element={<CadastroPage />} />
        <Route path="/login/verificar" element={<VerificarEmailPage />} />
        <Route path="/login/sucesso" element={<SucessoPage />} />
      </Route>

      <Route path="/verificar/:token" element={<ConfirmarEmailPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<HomeRedirectPage />} />
          <Route path="visao-geral" element={<VisaoGeralPage />} />
          <Route path="servicos" element={<ServicosPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="agendamentos" element={<AgendamentosEmpresaPage />} />
          <Route path="solicitacoes" element={<SolicitacoesPage />} />
          <Route path="calendario" element={<CalendarRoutePage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="notificacoes" element={<NotificationsRoutePage />} />
          <Route path="perfil" element={<ProfileRoutePage />} />
          <Route path="perfil-publico" element={<PerfilEmpresaPublicoPage />} />
          <Route path="explorar" element={<ExplorarPage />} />
          <Route path="meus-agendamentos" element={<MeusAgendamentosPage />} />
          <Route path="dependentes" element={<DependentesPage />} />
          <Route path="documentos" element={<DocumentosPage />} />
          <Route path="fila" element={<FilaEsperaPage />} />
          <Route path="mensagens" element={<MensagensPage />} />
          <Route path="*" element={<Dashboard404Page />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
