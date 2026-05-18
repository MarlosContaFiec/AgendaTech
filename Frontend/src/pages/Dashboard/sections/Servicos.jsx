import { useState, useEffect } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { formatMoney } from "@/utils/formatters";
import api from "@/services/api";

export default function Servicos({ token, showToast }) {
  const [servicos, setServicos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const res = await api("GET", "/api/servicos", null, token);
    if (res.success) setServicos(res.data || []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  function novoServico() {
    setEditando({ id: null, nome: "", descricao: "", duracao_minutos: 30, preco_base: "", aceitamento_automatico: true, max_por_horario: "", hora_inicio: "09:00", hora_fim: "18:00", intervalo_minutos: 0 });
  }

  function editarServico(s) {
    setEditando({ ...s, preco_base: String(s.preco_base || ""), max_por_horario: s.max_por_horario ? String(s.max_por_horario) : "" });
  }

  async function salvar() {
    const s = editando;
    const body = {
      nome: s.nome, descricao: s.descricao, duracao_minutos: Number(s.duracao_minutos), preco_base: Number(s.preco_base) || 0,
      aceitamento_automatico: s.aceitamento_automatico, max_por_horario: s.max_por_horario ? Number(s.max_por_horario) : null,
      hora_inicio: s.hora_inicio, hora_fim: s.hora_fim, intervalo_minutos: Number(s.intervalo_minutos) || 0,
    };
    const res = s.id ? await api("PUT", "/api/servicos/" + s.id, body, token) : await api("POST", "/api/servicos", body, token);
    if (res.success) { showToast(s.id ? "Serviço atualizado!" : "Serviço criado!"); setEditando(null); carregar(); }
    else showToast(res.message || "Erro ao salvar.", "error");
  }

  async function excluir(id) {
    if (!confirm("Desativar este serviço?")) return;
    const res = await api("DELETE", "/api/servicos/" + id, null, token);
    if (res.success) { showToast("Serviço desativado."); carregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  if (loading) return <div className="text-center py-10 text-muted">Carregando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-black text-xl mb-1">Serviços</h2>
          <p className="text-muted text-[0.85rem]">Gerencie os serviços da sua empresa</p>
        </div>
        <Button onClick={novoServico}>＋ Novo Serviço</Button>
      </div>

      {editando && (
        <div className="bg-surface border border-line rounded-card p-6 mb-6 animate-[fadeUp_.25s_ease]">
          <h3 className="font-heading font-bold text-lg mb-4">{editando.id ? "Editar Serviço" : "Novo Serviço"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="Nome" value={editando.nome} onChange={e => setEditando(p => ({ ...p, nome: e.target.value }))} required />
            <Input label="Duração (minutos)" type="number" value={editando.duracao_minutos} onChange={e => setEditando(p => ({ ...p, duracao_minutos: e.target.value }))} />
            <Input label="Preço (R$)" type="number" step="0.01" value={editando.preco_base} onChange={e => setEditando(p => ({ ...p, preco_base: e.target.value }))} />
            <Input label="Máx por horário" type="number" value={editando.max_por_horario} onChange={e => setEditando(p => ({ ...p, max_por_horario: e.target.value }))} placeholder="Vazio = ilimitado" />
            <Input label="Hora início" type="time" value={editando.hora_inicio} onChange={e => setEditando(p => ({ ...p, hora_inicio: e.target.value }))} />
            <Input label="Hora fim" type="time" value={editando.hora_fim} onChange={e => setEditando(p => ({ ...p, hora_fim: e.target.value }))} />
          </div>
          <Textarea label="Descrição" value={editando.descricao} onChange={e => setEditando(p => ({ ...p, descricao: e.target.value }))} rows={3} />
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-[0.85rem]">
              <input type="checkbox" checked={editando.aceitamento_automatico} onChange={e => setEditando(p => ({ ...p, aceitamento_automatico: e.target.checked }))} className="accent-purple" />
              Aceitamento automático
            </label>
          </div>
          <div className="flex gap-3">
            <Button onClick={salvar}>💾 Salvar</Button>
            <Button variant="ghost" onClick={() => setEditando(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicos.map(s => (
          <div key={s.id} className="bg-surface border border-line rounded-card p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold text-[0.95rem]">{s.nome}</div>
              <span className="text-[0.72rem] text-muted">{s.duracao_minutos}min</span>
            </div>
            <div className="text-[0.82rem] font-bold text-purple mb-1">{formatMoney(s.preco_base)}</div>
            <div className="text-[0.75rem] text-muted mb-3 line-clamp-2">{s.descricao || "Sem descrição"}</div>
            <div className="text-[0.68rem] text-muted mb-3">
              🕐 {s.hora_inicio?.slice(0,5)} — {s.hora_fim?.slice(0,5)} · {s.aceitamento_automatico ? "⚡ Auto" : "🔍 Manual"}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => editarServico(s)}>✏️ Editar</Button>
              <Button variant="danger" size="sm" onClick={() => excluir(s.id)}>🗑</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
