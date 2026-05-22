import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Textarea, Spinner, Toast } from "@/components/ui";
import api from "@/services/api";
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiClock, FiMessageCircle, FiSettings } from "react-icons/fi";

export default function Configuracoes() {
  const { user } = useAuth();
  const [aba, setAba] = useState("regras-negocio");
  const [regrasNegocio, setRegrasNegocio] = useState([]);
  const [capacidades, setCapacidades] = useState([]);
  const [chatConfig, setChatConfig] = useState(null);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [editRN, setEditRN] = useState(null);
  const [editCap, setEditCap] = useState(null);
  const [editFaq, setEditFaq] = useState(null);

  function showToast(msg, type = "success") { setToast({ msg, type }); }

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      setLoading(true);
      const [rnRes, capRes, chatRes] = await Promise.all([
        api("GET", "/api/regras-negocio", null, user.token),
        api("GET", "/api/empresa/capacidades", null, user.token),
        api("GET", "/api/mensagens/chat-config", null, user.token),
      ]);
      if (cancelado) return;
      if (rnRes.success) setRegrasNegocio(rnRes.data || []);
      if (capRes.success) setCapacidades(capRes.data || []);
      if (chatRes.success) {
        setChatConfig(chatRes.data.config || { mensagem_abertura: "", ativo: true });
        setFaq(chatRes.data.faq || []);
      }
      setLoading(false);
    }
    carregar();
    return () => { cancelado = true; };
  }, [user]);

  async function recarregar() {
    const [rnRes, capRes, chatRes] = await Promise.all([
      api("GET", "/api/regras-negocio", null, user.token),
      api("GET", "/api/empresa/capacidades", null, user.token),
      api("GET", "/api/mensagens/chat-config", null, user.token),
    ]);
    if (rnRes.success) setRegrasNegocio(rnRes.data || []);
    if (capRes.success) setCapacidades(capRes.data || []);
    if (chatRes.success) {
      setChatConfig(chatRes.data.config || { mensagem_abertura: "", ativo: true });
      setFaq(chatRes.data.faq || []);
    }
  }

  async function salvarRN() {
    const r = editRN;
    const body = { ...r, antecedencia_horas: r.antecedencia_horas ? Number(r.antecedencia_horas) : null, limite_horas: r.limite_horas ? Number(r.limite_horas) : null, taxa_percentual: r.taxa_percentual ? Number(r.taxa_percentual) : null, taxa_fixa: r.taxa_fixa ? Number(r.taxa_fixa) : null, estrelas_min: r.estrelas_min ? Number(r.estrelas_min) : null, estrelas_max: r.estrelas_max ? Number(r.estrelas_max) : null, ativo: r.ativo !== false };
    const res = r.id ? await api("PUT", `/api/regras-negocio/${r.id}`, body, user.token) : await api("POST", "/api/regras-negocio", body, user.token);
    if (res.success) { showToast(r.id ? "Regra atualizada!" : "Regra criada!"); setEditRN(null); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function excluirRN(id) {
    if (!confirm("Remover?")) return;
    const res = await api("DELETE", `/api/regras-negocio/${id}`, null, user.token);
    if (res.success) { showToast("Removida."); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function salvarCap() {
    const c = editCap;
    const body = { hora_inicio: c.hora_inicio, hora_fim: c.hora_fim, max_agendamentos: Number(c.max_agendamentos) };
    const res = c.id ? await api("PUT", `/api/empresa/capacidades/${c.id}`, body, user.token) : await api("POST", "/api/empresa/capacidades", body, user.token);
    if (res.success) { showToast(c.id ? "Atualizada!" : "Criada!"); setEditCap(null); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function excluirCap(id) {
    if (!confirm("Remover?")) return;
    const res = await api("DELETE", `/api/empresa/capacidades/${id}`, null, user.token);
    if (res.success) { showToast("Removida."); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function salvarChatConfig() {
    const res = await api("PUT", "/api/mensagens/chat-config", chatConfig, user.token);
    if (res.success) showToast("Chat atualizado!");
    else showToast(res.message || "Erro.", "error");
  }

  async function salvarFaq() {
    const f = editFaq;
    const body = { pergunta: f.pergunta, resposta: f.resposta, ordem: Number(f.ordem) || 0 };
    const res = f.id ? await api("PUT", `/api/mensagens/chat-config/faq/${f.id}`, body, user.token) : await api("POST", "/api/mensagens/chat-config/faq", body, user.token);
    if (res.success) { showToast(f.id ? "FAQ atualizada!" : "FAQ criada!"); setEditFaq(null); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function excluirFaq(id) {
    if (!confirm("Remover?")) return;
    const res = await api("DELETE", `/api/mensagens/chat-config/faq/${id}`, null, user.token);
    if (res.success) { showToast("Removida."); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  if (loading) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;

  const tiposRN = [
    { value: "notificacao", label: "Notificação" },
    { value: "cancelamento", label: "Cancelamento" },
    { value: "reagendamento", label: "Reagendamento" },
  ];

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Configurações</h2>
        <p className="text-muted text-[0.85rem]">Regras de negócio, capacidade e chat</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "regras-negocio", label: "Regras de Negócio", icon: FiSettings },
          { id: "capacidade", label: "Capacidade", icon: FiClock },
          { id: "chat", label: "Chat / FAQ", icon: FiMessageCircle },
        ].map(a => {
          const Icon = a.icon;
          return (
            <button key={a.id} onClick={() => setAba(a.id)}
              className={"px-4 py-2 rounded-btn text-[0.82rem] font-bold cursor-pointer transition-all border flex items-center gap-2 " +
                (aba === a.id ? "bg-purple text-white border-purple" : "bg-surface-alt text-muted border-line hover:border-purple/40")}>
              <Icon size={14} />{a.label}
            </button>
          );
        })}
      </div>

      {aba === "regras-negocio" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg">Regras de Negócio</h3>
            <Button size="sm" onClick={() => setEditRN({ id: null, tipo: "notificacao", nome: "", descricao: "", antecedencia_horas: "", mensagem_template: "", tipo_notificacao: "lembrete", limite_horas: "", taxa_percentual: "", taxa_fixa: "", ativo: true })}>
              <FiPlus size={14} /> Nova Regra
            </Button>
          </div>
          {regrasNegocio.length === 0 ? (
            <p className="text-muted text-center py-10">Nenhuma regra cadastrada.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {regrasNegocio.map(r => (
                <div key={r.id} className="bg-surface border border-line rounded-card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-[0.9rem]">{r.nome}</div>
                    <div className="text-[0.72rem] text-muted">
                      {r.tipo}{r.antecedencia_horas && ` · ${r.antecedencia_horas}h antes`}{r.limite_horas && ` · Limite: ${r.limite_horas}h`}{r.taxa_percentual && ` · Taxa: ${r.taxa_percentual}%`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditRN(r)}><FiEdit2 size={12} /></Button>
                    <Button variant="danger" size="sm" onClick={() => excluirRN(r.id)}><FiTrash2 size={12} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editRN && (
            <div className="bg-surface border border-line rounded-card p-6 mt-6 animate-[fadeUp_.25s_ease]">
              <h4 className="font-heading font-bold text-lg mb-4">{editRN.id ? "Editar Regra" : "Nova Regra"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">Tipo</label>
                  <select value={editRN.tipo} onChange={e => setEditRN(p => ({ ...p, tipo: e.target.value }))}
                    className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
                    {tiposRN.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <Input label="Nome" value={editRN.nome} onChange={e => setEditRN(p => ({ ...p, nome: e.target.value }))} />
                {editRN.tipo === "notificacao" && (
                  <>
                    <Input label="Antecedência (horas)" type="number" value={editRN.antecedencia_horas} onChange={e => setEditRN(p => ({ ...p, antecedencia_horas: e.target.value }))} />
                    <div>
                      <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">Tipo Notificação</label>
                      <select value={editRN.tipo_notificacao} onChange={e => setEditRN(p => ({ ...p, tipo_notificacao: e.target.value }))}
                        className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
                        <option value="lembrete">Lembrete</option>
                        <option value="confirmacao">Confirmação</option>
                        <option value="cancelamento">Cancelamento</option>
                        <option value="reagendamento">Reagendamento</option>
                      </select>
                    </div>
                  </>
                )}
                {editRN.tipo === "cancelamento" && (
                  <>
                    <Input label="Limite (horas)" type="number" value={editRN.limite_horas} onChange={e => setEditRN(p => ({ ...p, limite_horas: e.target.value }))} />
                    <Input label="Taxa (%)" type="number" value={editRN.taxa_percentual} onChange={e => setEditRN(p => ({ ...p, taxa_percentual: e.target.value }))} />
                  </>
                )}
                {editRN.tipo === "reagendamento" && (
                  <Input label="Limite (horas)" type="number" value={editRN.limite_horas} onChange={e => setEditRN(p => ({ ...p, limite_horas: e.target.value }))} />
                )}
              </div>
              <Textarea label="Template da Mensagem" value={editRN.mensagem_template || ""} onChange={e => setEditRN(p => ({ ...p, mensagem_template: e.target.value }))} placeholder="Variáveis: {nome_cliente}, {servico}, {hora}, {data}, {taxa}..." rows={3} className="mb-4" />
              <div className="flex gap-3">
                <Button onClick={salvarRN}><FiSave size={14} /> Salvar</Button>
                <Button variant="ghost" onClick={() => setEditRN(null)}>Cancelar</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {aba === "capacidade" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg">Capacidade por Horário</h3>
            <Button size="sm" onClick={() => setEditCap({ id: null, hora_inicio: "09:00", hora_fim: "12:00", max_agendamentos: 5 })}>
              <FiPlus size={14} /> Nova Capacidade
            </Button>
          </div>
          {capacidades.length === 0 ? (
            <p className="text-muted text-center py-10">Nenhuma capacidade configurada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {capacidades.map(c => (
                <div key={c.id} className="bg-surface border border-line rounded-card p-4">
                  <div className="font-bold text-[0.9rem] mb-1">{c.hora_inicio?.slice(0, 5)} — {c.hora_fim?.slice(0, 5)}</div>
                  <div className="text-[0.82rem] text-purple font-bold">{c.max_agendamentos} simultâneos</div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => setEditCap(c)}><FiEdit2 size={12} /></Button>
                    <Button variant="danger" size="sm" onClick={() => excluirCap(c.id)}><FiTrash2 size={12} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editCap && (
            <div className="bg-surface border border-line rounded-card p-6 mt-6 animate-[fadeUp_.25s_ease]">
              <h4 className="font-heading font-bold text-lg mb-4">{editCap.id ? "Editar Capacidade" : "Nova Capacidade"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input label="Hora Início" type="time" value={editCap.hora_inicio} onChange={e => setEditCap(p => ({ ...p, hora_inicio: e.target.value }))} />
                <Input label="Hora Fim" type="time" value={editCap.hora_fim} onChange={e => setEditCap(p => ({ ...p, hora_fim: e.target.value }))} />
                <Input label="Máx Agendamentos" type="number" value={editCap.max_agendamentos} onChange={e => setEditCap(p => ({ ...p, max_agendamentos: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <Button onClick={salvarCap}><FiSave size={14} /> Salvar</Button>
                <Button variant="ghost" onClick={() => setEditCap(null)}>Cancelar</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {aba === "chat" && (
        <div>
          <div className="bg-surface border border-line rounded-card p-6 mb-6">
            <h3 className="font-heading font-bold text-lg mb-4">Configuração do Chat</h3>
            <div className="flex flex-col gap-4 mb-4">
              <Textarea label="Mensagem de Abertura" value={chatConfig?.mensagem_abertura || ""} onChange={e => setChatConfig(p => ({ ...p, mensagem_abertura: e.target.value }))} rows={3} />
              <label className="flex items-center gap-2 cursor-pointer text-[0.85rem]">
                <input type="checkbox" checked={chatConfig?.ativo !== false} onChange={e => setChatConfig(p => ({ ...p, ativo: e.target.checked }))} className="accent-purple" />
                Chat ativo
              </label>
            </div>
            <Button onClick={salvarChatConfig}><FiSave size={14} /> Salvar Configuração</Button>
          </div>

          <div className="bg-surface border border-line rounded-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg">Perguntas Frequentes</h3>
              <Button size="sm" onClick={() => setEditFaq({ id: null, pergunta: "", resposta: "", ordem: 0 })}>
                <FiPlus size={14} /> Nova Pergunta
              </Button>
            </div>
            {faq.length === 0 ? (
              <p className="text-muted text-center py-6">Nenhuma FAQ cadastrada.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {faq.map(f => (
                  <div key={f.id} className="bg-surface-alt border border-line rounded-card p-4">
                    <div className="font-bold text-[0.9rem] mb-1">{f.pergunta}</div>
                    <div className="text-[0.78rem] text-muted-light">{f.resposta}</div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => setEditFaq(f)}><FiEdit2 size={12} /></Button>
                      <Button variant="danger" size="sm" onClick={() => excluirFaq(f.id)}><FiTrash2 size={12} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {editFaq && (
              <div className="bg-surface border border-line rounded-card p-6 mt-4 animate-[fadeUp_.25s_ease]">
                <h4 className="font-heading font-bold text-lg mb-4">{editFaq.id ? "Editar FAQ" : "Nova FAQ"}</h4>
                <div className="flex flex-col gap-3 mb-4">
                  <Input label="Pergunta" value={editFaq.pergunta} onChange={e => setEditFaq(p => ({ ...p, pergunta: e.target.value }))} />
                  <Textarea label="Resposta" value={editFaq.resposta} onChange={e => setEditFaq(p => ({ ...p, resposta: e.target.value }))} rows={3} />
                  <Input label="Ordem" type="number" value={editFaq.ordem} onChange={e => setEditFaq(p => ({ ...p, ordem: e.target.value }))} />
                </div>
                <div className="flex gap-3">
                  <Button onClick={salvarFaq}><FiSave size={14} /> Salvar</Button>
                  <Button variant="ghost" onClick={() => setEditFaq(null)}>Cancelar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
