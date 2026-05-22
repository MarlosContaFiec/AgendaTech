import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Spinner, Toast } from "@/components/ui";
import { formatDate, formatHora } from "@/utils/formatters";
import { statusColor, statusLabel } from "@/utils/calculators";
import ModalAvaliacao from "@/components/shared/ModalAvaliacao";
import api from "@/services/api";
import { FiCalendar, FiClock, FiStar, FiXCircle } from "react-icons/fi";

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [avaliando, setAvaliando] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  async function carregar() {
    const params = filtro ? "?status=" + filtro : "";
    const res = await api("GET", "/api/agendamentos/cliente" + params, null, user.token);
    if (res.success) setAgendamentos(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [filtro]);

  async function cancelar(id) {
    const motivo = prompt("Motivo do cancelamento:");
    if (!motivo) return;
    const res = await api("PUT", "/api/agendamentos/" + id + "/cancelar", { motivo }, user.token);
    if (res.success) {
      const msg = res.data?.taxaInfo?.mensagem || "Agendamento cancelado.";
      const type = res.data?.taxaInfo ? "warning" : "success";
      showToast(msg, type);
      carregar();
    } else {
      showToast(res.message || "Erro ao cancelar.", "error");
    }
  }

  const filtros = ["", "confirmado", "pendente", "cancelado", "concluido"];
  const filtrosLabel = { "": "Todos", confirmado: "Confirmados", pendente: "Pendentes", cancelado: "Cancelados", concluido: "Concluídos" };

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />
      {avaliando && <ModalAvaliacao agendamento={avaliando} onClose={() => setAvaliando(null)} onConcluido={carregar} />}

      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Meus Agendamentos</h2>
        <p className="text-muted text-[0.85rem]">Acompanhe seus horários</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filtros.map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={"px-4 py-2 rounded-btn text-[0.82rem] font-bold cursor-pointer transition-all border " +
              (filtro === f ? "bg-purple text-white border-purple" : "bg-surface-alt text-muted border-line hover:border-purple/40")}>
            {filtrosLabel[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner size={24} /></div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-card">
          <FiCalendar size={40} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-[0.9rem]">Nenhum agendamento encontrado.</p>
          <p className="text-muted text-[0.78rem] mt-1">Vá em Explorar para encontrar serviços.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {agendamentos.map(ag => (
            <div key={ag.id} className="bg-surface border border-line rounded-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple font-black flex-shrink-0">
                {formatDate(ag.data_agendamento).slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[0.9rem] truncate">{ag.servico_nome}</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-[1px] rounded-badge" style={{ color: statusColor(ag.status_agendamento), background: statusColor(ag.status_agendamento) + "18" }}>
                    {statusLabel(ag.status_agendamento)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[0.78rem] text-muted">
                  <span className="flex items-center gap-1"><FiCalendar size={12} />{formatDate(ag.data_agendamento)}</span>
                  <span className="flex items-center gap-1"><FiClock size={12} />{formatHora(ag.hora_inicio)} — {formatHora(ag.hora_fim)}</span>
                  <span>{ag.empresa_nome}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {(ag.status_agendamento === "confirmado" || ag.status_agendamento === "pendente") && (
                  <Button variant="danger" size="sm" onClick={() => cancelar(ag.id)}>
                    <FiXCircle size={14} /> Cancelar
                  </Button>
                )}
                {ag.status_agendamento === "concluido" && (
                  <Button variant="gold" size="sm" onClick={() => setAvaliando(ag)}>
                    <FiStar size={14} /> Avaliar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
