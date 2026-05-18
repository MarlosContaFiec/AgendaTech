import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { formatHora } from "@/utils/formatters";
import api from "@/services/api";

export default function Solicitacoes({ token, showToast }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const res = await api("GET", "/api/solicitacoes/pendentes", null, token);
    if (res.success) setSolicitacoes(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function responder(id, status) {
    const resposta = status === "negado" ? prompt("Resposta para o cliente:") : "Aprovado";
    if (status === "negado" && !resposta) return;
    const res = await api("PUT", "/api/solicitacoes/" + id + "/responder", { status, resposta_empresa: resposta || "" }, token);
    if (res.success) { showToast(status === "aceito" ? "Solicitação aceita!" : "Solicitação negada."); carregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Solicitações</h2>
        <p className="text-muted text-[0.85rem]">Pedidos de horário estendido</p>
      </div>

      {loading ? <div className="text-center py-10 text-muted">Carregando...</div>
        : solicitacoes.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-line rounded-card">
            <div className="text-[2.5rem] mb-3">✅</div>
            <p className="text-muted">Nenhuma solicitação pendente.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {solicitacoes.map(sol => (
              <div key={sol.id} className="bg-surface border border-line rounded-card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-[0.9rem]">+{sol.minutos_extra} minutos</div>
                    <div className="text-[0.78rem] text-muted">{sol.servico_nome} · {formatHora(sol.hora_inicio)}</div>
                  </div>
                </div>
                <p className="text-[0.82rem] text-muted-light mb-3">{sol.motivo}</p>
                <div className="flex gap-2">
                  <Button variant="success" size="sm" onClick={() => responder(sol.id, "aceito")}>✓ Aceitar</Button>
                  <Button variant="danger" size="sm" onClick={() => responder(sol.id, "negado")}>✕ Negar</Button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
