import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Toast from "@/components/ui/Toast";
import { getAccessToken } from "@/services/auth";
import api from "@/services/api";

import Explorar from "./sections/Explorar";
import MeusAgendamentos from "./sections/MeusAgendamentos";
import PerfilCliente from "./sections/PerfilCliente";
import VisaoGeral from "./sections/VisaoGeral";
import Servicos from "./sections/Servicos";
import AgendamentosEmpresa from "./sections/AgendamentosEmpresa";
import Solicitacoes from "./sections/Solicitacoes";
import Notificacoes from "./sections/Notificacoes";
import PerfilEmpresa from "./sections/PerfilEmpresa";
import PerfilEmpresaPublico from "./sections/PerfilEmpresaPublico";

import ChatBot from "@/components/shared/ChatBot";

export default function Dashboard() {
  const { tipo, user } = useAuth();
  const isEmpresa = tipo === "empresa";
  const token = getAccessToken();
  const navigate = useNavigate();

  const [aba, setAba] = useState(isEmpresa ? "dashboard" : "explorar");
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [notificacoes, setNotificacoes] = useState([]);
  const [totalPendentes, setTotalPendentes] = useState(0);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  }

  const badges = {};
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  if (naoLidas > 0) badges.notificacoes = naoLidas;
  if (totalPendentes > 0) badges.solicitacoes = totalPendentes;

  return (
    <AppLayout aba={aba} setAba={setAba} badges={badges}>
      <Routes>
        <Route path="/" element={
          isEmpresa ? (
            <>
              {aba === "dashboard" && <VisaoGeral token={token} onStats={setTotalPendentes} />}
              {aba === "servicos" && <Servicos token={token} showToast={showToast} />}
              {aba === "agendamentos" && <AgendamentosEmpresa token={token} showToast={showToast} />}
              {aba === "solicitacoes" && <Solicitacoes token={token} showToast={showToast} />}
              {aba === "notificacoes" && <Notificacoes notificacoes={notificacoes} />}
              {aba === "perfil" && <PerfilEmpresa token={token} user={user} showToast={showToast} />}
            </>
          ) : (
            <>
              {aba === "explorar" && <Explorar token={token} showToast={showToast} />}
              {aba === "agendamentos" && <MeusAgendamentos token={token} showToast={showToast} />}
              {aba === "notificacoes" && <Notificacoes notificacoes={notificacoes} />}
              {aba === "perfil" && <PerfilCliente token={token} user={user} showToast={showToast} />}
            </>
          )
        } />
        <Route path="empresa/:id" element={<PerfilEmpresaPublico showToast={showToast} />} />
      </Routes>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "", type: "success" })} />
      <ChatBot />
    </AppLayout>
  );
}
