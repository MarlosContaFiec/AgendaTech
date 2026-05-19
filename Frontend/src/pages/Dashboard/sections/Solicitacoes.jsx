import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Spinner, Toast } from "@/components/ui";
import { formatHora } from "@/utils/formatters";
import api from "@/services/api";
import { FiClock, FiCheck, FiX, FiInbox } from "react-icons/fi";

export default function Solicitacoes() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  async function carregar() {
    const res = await api("GET", "/api/solicitacoes/pendentes", null, user.token);
    if (res.success) setSolicitacoes(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function responder(id, status) {
    const resposta = status === "negado" ? prompt("Resposta para o cliente:") : "Aprovado";
    if (status === "negado" && !resposta) return;
    const res = await api("PUT", "/api/solicitacoes/" + id + "/responder", { status, resposta_empresa: resposta || "" }, user.token);
    if (res.success) {
      showToast(status === "aceito" ? "Solicitação aceita!" : "Solicitação negada.");
      carregar();
    } else {
      showToast(res.message || "Erro.", "error");
    }
  }

  if (loading) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Solicitações</h2>
        <p className="text-muted text-[0.85rem]">Pedidos de horário estendido</p>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-line rounded-card">
          <FiInbox size={40} className="text-muted mx-auto mb-3" />
          <p className="text-muted">Nenhuma solicitação pendente.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {solicitacoes.map(sol => (
            <div key={sol.id} className="bg-surface border border-line rounded-card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-[0.9rem] text-purple">+{sol.minutos_extra} minutos</div>
                  <div className="flex items-center gap-2 text-[0.78rem] text-muted mt-1">
                    <span>{sol.servico_nome}</span>
                    <span className="flex items-center gap-1"><FiClock size={11} />{formatHora(sol.hora_inicio)}</span>
                  </div>
                </div>
              </div>
              <p className="text-[0.82rem] text-muted-light mb-3">{sol.motivo}</p>
              <div className="flex gap-2">
                <Button variant="success" size="sm" onClick={() => responder(sol.id, "aceito")}><FiCheck size={14} /> Aceitar</Button>
                <Button variant="danger" size="sm" onClick={() => responder(sol.id, "negado")}><FiX size={14} /> Negar</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
