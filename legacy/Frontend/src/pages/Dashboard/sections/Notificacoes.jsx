import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui";
import { timeAgo } from "@/utils/formatters";
import { FiBell, FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";

const ICON_MAP = {
  lembrete: FiInfo,
  confirmacao: FiCheckCircle,
  cancelamento: FiXCircle,
  reagendamento: FiAlertTriangle,
};
const COLOR_MAP = {
  lembrete: "text-purple",
  confirmacao: "text-success",
  cancelamento: "text-danger",
  reagendamento: "text-warning",
};

export default function Notificacoes() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await (await import("@/services/api")).default("GET", "/api/notificacoes", null, user.token);
        if (res.success) setItems(res.data || []);
      } catch {}
      setLoading(false);
    }
    carregar();
  }, [user]);

  if (loading) return (
    <div className="flex justify-center py-10"><Spinner size={24} /></div>
  );

  if (items.length === 0) return (
    <div className="text-center py-16 bg-surface border border-line rounded-card">
      <FiBell size={40} className="text-muted mx-auto mb-3" />
      <p className="text-muted text-[0.9rem]">Nenhuma notificação.</p>
      <p className="text-muted text-[0.78rem] mt-1">Notificações de agendamentos e atualizações aparecerão aqui.</p>
    </div>
  );

  const naoLidas = items.filter(n => !n.lida).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Notificações</h2>
        <p className="text-muted text-[0.85rem]">{naoLidas} não lida{naoLidas !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex flex-col gap-3">
        {[...items].reverse().map(n => {
          const Icon = ICON_MAP[n.tipo] || FiInfo;
          const cor = COLOR_MAP[n.tipo] || "text-muted";
          return (
            <div key={n.id} className={"bg-surface border rounded-card p-4 flex items-start gap-3 " + (n.lida ? "border-line opacity-60" : "border-purple/30")}>
              <div className={"w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center flex-shrink-0 " + cor}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-[0.85rem] text-muted-light">{n.mensagem || n.tipo}</p>
                <span className="text-[0.72rem] text-muted mt-1 inline-block">{timeAgo(n.criadaEm || n.enviado_em)}</span>
              </div>
              {!n.lida && <div className="w-2 h-2 rounded-full bg-purple mt-2 flex-shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
