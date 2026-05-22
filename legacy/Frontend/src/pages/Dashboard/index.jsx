import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import ChatBot from "@/components/shared/ChatBot";

import VisaoGeral from "./sections/VisaoGeral";
import Servicos from "./sections/Servicos";
import AgendamentosEmpresa from "./sections/AgendamentosEmpresa";
import Solicitacoes from "./sections/Solicitacoes";
import Notificacoes from "./sections/Notificacoes";
import PerfilEmpresa from "./sections/PerfilEmpresa";
import PerfilEmpresaPublico from "./sections/PerfilEmpresaPublico";
import Explorar from "./sections/Explorar";
import MeusAgendamentos from "./sections/MeusAgendamentos";
import PerfilCliente from "./sections/PerfilCliente";

const SEC_EMPRESA = {
  dashboard: VisaoGeral,
  servicos: Servicos,
  agendamentos: AgendamentosEmpresa,
  solicitacoes: Solicitacoes,
  notificacoes: Notificacoes,
  perfil: PerfilEmpresa,
};

const SEC_CLIENTE = {
  explorar: Explorar,
  agendamentos: MeusAgendamentos,
  notificacoes: Notificacoes,
  perfil: PerfilCliente,
};

export default function Dashboard() {
  const { tipo } = useAuth();
  const { pathname } = useLocation();
  const isEmpresa = tipo === "empresa";
  const sec = isEmpresa ? SEC_EMPRESA : SEC_CLIENTE;
  const def = isEmpresa ? "dashboard" : "explorar";
  const aba = pathname.split("/")[2] || def;

  if (pathname.startsWith("/dashboard/empresa/")) {
    return (
      <AppLayout>
        <PerfilEmpresaPublico />
      </AppLayout>
    );
  }

  if (!sec[aba]) return <Navigate to={`/dashboard/${def}`} replace />;

  const Section = sec[aba];
  return (
    <AppLayout>
      <Section />
      <ChatBot />
    </AppLayout>
  );
}