import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiCalendar, FiBell, FiUser, FiGrid, FiScissors, FiMail, FiBriefcase, FiLogOut } from "react-icons/fi";
import Logo from "@/components/shared/Logo";

const NAV_CLIENTE = [
  { id: "explorar", label: "Explorar", icon: FiSearch },
  { id: "agendamentos", label: "Agendamentos", icon: FiCalendar },
  { id: "notificacoes", label: "Notificações", icon: FiBell },
  { id: "perfil", label: "Meu Perfil", icon: FiUser },
];

const NAV_EMPRESA = [
  { id: "dashboard", label: "Visão Geral", icon: FiGrid },
  { id: "servicos", label: "Serviços", icon: FiScissors },
  { id: "agendamentos", label: "Agendamentos", icon: FiCalendar },
  { id: "solicitacoes", label: "Solicitações", icon: FiBell },
  { id: "notificacoes", label: "Notificações", icon: FiMail },
  { id: "perfil", label: "Perfil", icon: FiBriefcase },
];

export default function AppLayout({ children, badges = {} }) {
  const { tipo, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEmpresa = tipo === "empresa";
  const nav = isEmpresa ? NAV_EMPRESA : NAV_CLIENTE;
  const aba = pathname.split("/")[2] || (isEmpresa ? "dashboard" : "explorar");

  return (
    <div className="flex h-screen bg-base text-foreground font-body overflow-hidden">
      <aside className="w-[220px] bg-surface border-r border-line flex flex-col pt-5 flex-shrink-0">
        <div className="px-5 pb-6">
          <Logo />
        </div>
        <div className="px-4 pb-2 text-[0.6rem] text-muted uppercase tracking-widest">Menu</div>
        {nav.map(item => {
          const Icon = item.icon;
          const ativo = aba === item.id;
          return (
            <div key={item.id} onClick={() => navigate(`/dashboard/${item.id}`)}
              className={"px-4 py-2.5 flex items-center gap-2.5 cursor-pointer text-[0.87rem] transition-all border-l-[3px] " +
                (ativo ? "text-purple bg-purple/10 border-purple" : "text-muted border-transparent hover:text-muted-light hover:bg-surface-alt")}>
              <Icon size={18} className={ativo ? "text-purple" : ""} />
              <span className="flex-1">{item.label}</span>
              {badges[item.id] > 0 && (
                <span className={"text-[0.62rem] font-bold px-2 py-[1px] rounded-badge " + (ativo ? "bg-purple text-white" : "bg-surface-hover text-muted")}>{badges[item.id]}</span>
              )}
            </div>
          );
        })}
        <div className="mt-auto p-4 border-t border-line">
          <div className="text-[0.72rem] text-muted mb-2 truncate px-1">{user?.nome || user?.nome_fantasia || user?.email || ""}</div>
          <button onClick={logout} className="w-full py-2.5 rounded-btn bg-surface-alt text-muted text-[0.82rem] font-semibold cursor-pointer border border-line hover:border-danger/50 hover:text-danger transition-all flex items-center justify-center gap-2">
            <FiLogOut size={15} />
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[62px] px-7 flex items-center justify-between border-b border-line bg-surface flex-shrink-0">
          <h1 className="font-heading font-bold text-base">{nav.find(n => n.id === aba)?.label || ""}</h1>
          <span className="text-[0.78rem] text-muted">{isEmpresa ? (user?.nome_fantasia || "Empresa") : (user?.nome || "Cliente")}</span>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
