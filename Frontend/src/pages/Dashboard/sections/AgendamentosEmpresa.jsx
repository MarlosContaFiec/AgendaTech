import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Toast } from "@/components/ui";
import { formatDate, formatHora } from "@/utils/formatters";
import { statusColor, statusLabel } from "@/utils/calculators";
import api from "@/services/api";
import { FiCalendar, FiClock, FiCheck, FiX } from "react-icons/fi";

export default function AgendamentosEmpresa() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  async function carregar() {
    const params = filtro ? "?status=" + filtro : "";
    const res = await api("GET", "/api/agendamentos/empresa" + params, null, user.token);
    if (res.success) setAgendamentos(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [filtro]);

  async function aceitar(id) {
    const res = await api("PUT", "/api/agendamentos/" + id + "/aceitar", null, user.token);
    if (res.success) { showToast("Agendamento aceito!"); carregar(); } else showToast(res.message || "Erro.", "error");
  }

  async function recusar(id) {
    const motivo = prompt("Motivo da recusa:");
    if (!motivo) return;
    const res = await api("PUT", "/api/agendamentos/" + id + "/recusar", { motivo }, user.token);
    if (res.success) { showToast("Agendamento recusado."); carregar(); } else showToast(res.message || "Erro.", "error");
  }

  async function concluir(id) {
    const res = await api("PUT", "/api/agendamentos/" + id + "/concluir", null, user.token);
    if (res.success) { showToast("Agendamento concluído!"); carregar(); } else showToast(res.message || "Erro.", "error");
  }

  const filtros = ["", "pendente", "confirmado", "cancelado", "concluido"];

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Agendamentos</h2>
        <p className="text-muted text-[0.85rem]">Gerencie os agendamentos recebidos</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filtros.map(f => (
          <button key={f} onClick={() => { setFiltro(f); setLoading(true); }}
            className={"px-4 py-2 rounded-btn text-[0.82rem] font-bold cursor-pointer transition-all border " +
              (filtro === f ? "bg-purple text-white border-purple" : "bg-surface-alt text-muted border-line hover:border-purple/40")}>
            {f ? statusLabel(f) : "Todos"}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-10 text-muted">Carregando...</div>
        : agendamentos.length === 0 ? <div className="text-center py-10 text-muted">Nenhum agendamento.</div>
        : (
        <div className="flex flex-col gap-3">
          {agendamentos.map(ag => (
            <div key={ag.id} className="bg-surface border border-line rounded-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center text-purple font-bold">{ag.cliente_nome?.[0] || "?"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[0.9rem]">{ag.cliente_nome}</span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider px-2 py-[1px] rounded-badge" style={{ color: statusColor(ag.status_agendamento), background: statusColor(ag.status_agendamento) + "18" }}>
                    {statusLabel(ag.status_agendamento)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[0.78rem] text-muted">
                  <span>{ag.servico_nome}</span>
                  <span className="flex items-center gap-1"><FiCalendar size={12} />{formatDate(ag.data_agendamento)}</span>
                  <span className="flex items-center gap-1"><FiClock size={12} />{formatHora(ag.hora_inicio)}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {ag.status_agendamento === "pendente" && (
                  <>
                    <Button variant="success" size="sm" onClick={() => aceitar(ag.id)}><FiCheck size={14} /> Aceitar</Button>
                    <Button variant="danger" size="sm" onClick={() => recusar(ag.id)}><FiX size={14} /></Button>
                  </>
                )}
                {ag.status_agendamento === "confirmado" && (
                  <Button variant="primary" size="sm" onClick={() => concluir(ag.id)}><FiCheck size={14} /> Concluir</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
