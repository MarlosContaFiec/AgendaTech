import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { formatDate, formatHora } from "@/utils/formatters";
import { statusColor, statusLabel } from "@/utils/calculators";
import api from "@/services/api";

export default function MeusAgendamentos({ token, showToast }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const params = filtro ? "?status=" + filtro : "";
    const res = await api("GET", "/api/agendamentos/cliente" + params, null, token);
    if (res.success) setAgendamentos(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, [filtro]);

  async function cancelar(id) {
    const motivo = prompt("Motivo do cancelamento:");
    if (!motivo) return;
    const res = await api("PUT", "/api/agendamentos/" + id + "/cancelar", { motivo }, token);
    if (res.success) {
      showToast("Agendamento cancelado.");
      carregar();
      if (res.data?.taxaInfo) showToast(res.data.taxaInfo.mensagem, "warning");
    } else {
      showToast(res.message || "Erro ao cancelar.", "error");
    }
  }

  const filtros = ["", "confirmado", "pendente", "cancelado", "concluido"];
  const filtrosLabel = { "": "Todos", confirmado: "Confirmados", pendente: "Pendentes", cancelado: "Cancelados", concluido: "Concluídos" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-black text-xl mb-1">Meus Agendamentos</h2>
          <p className="text-muted text-[0.85rem]">Acompanhe seus horários</p>
        </div>
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
        <div className="text-center py-10 text-muted">Carregando...</div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-card">
          <div className="text-[2.5rem] mb-3">📅</div>
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
                <div className="text-[0.78rem] text-muted">
                  📅 {formatDate(ag.data_agendamento)} · 🕐 {formatHora(ag.hora_inicio)} — {formatHora(ag.hora_fim)} · {ag.empresa_nome}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {(ag.status_agendamento === "confirmado" || ag.status_agendamento === "pendente") && (
                  <Button variant="danger" size="sm" onClick={() => cancelar(ag.id)}>Cancelar</Button>
                )}
                {ag.status_agendamento === "concluido" && (
                  <Button variant="gold" size="sm">⭐ Avaliar</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
