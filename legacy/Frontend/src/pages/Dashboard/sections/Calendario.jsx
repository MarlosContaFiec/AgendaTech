import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Modal, Spinner, Toast } from "@/components/ui";
import CalendarGrid from "@/components/shared/CalendarGrid";
import api from "@/services/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from "react-icons/fi";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

export default function Calendario() {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [regras, setRegras] = useState([]);
  const [calendario, setCalendario] = useState({});
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState("calendario");
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [editTag, setEditTag] = useState(null);
  const [editRegra, setEditRegra] = useState(null);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  function showToast(msg, type = "success") { setToast({ msg, type }); }

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      setLoading(true);
      const [tRes, rRes, cRes] = await Promise.all([
        api("GET", "/api/tags", null, user.token),
        api("GET", "/api/regras", null, user.token),
        api("GET", `/api/regras/calendario?ano=${ano}&mes=${mes}`, null, user.token),
      ]);
      if (cancelado) return;
      if (tRes.success) setTags(tRes.data || []);
      if (rRes.success) setRegras(rRes.data || []);
      if (cRes.success) setCalendario(cRes.data || {});
      setLoading(false);
    }
    carregar();
    return () => { cancelado = true; };
  }, [user, ano, mes]);

  async function recarregar() {
    const [tRes, rRes, cRes] = await Promise.all([
      api("GET", "/api/tags", null, user.token),
      api("GET", "/api/regras", null, user.token),
      api("GET", `/api/regras/calendario?ano=${ano}&mes=${mes}`, null, user.token),
    ]);
    if (tRes.success) setTags(tRes.data || []);
    if (rRes.success) setRegras(rRes.data || []);
    if (cRes.success) setCalendario(cRes.data || {});
  }

  const eventosPorData = {};
  Object.entries(calendario).forEach(([data, info]) => {
    if (info.tags?.length > 0) eventosPorData[data] = info.tags;
  });

  function navMes(dir) {
    let nm = mes + dir, na = ano;
    if (nm < 1) { nm = 12; na--; }
    if (nm > 12) { nm = 1; na++; }
    setMes(nm);
    setAno(na);
  }

  async function salvarTag() {
    const t = editTag;
    const body = { nome: t.nome, label: t.label, cor: t.cor || "#888888", aceita_agendamento: t.aceita_agendamento ? 1 : 0, info: t.info || null };
    const res = t.id ? await api("PUT", `/api/tags/${t.id}`, body, user.token) : await api("POST", "/api/tags", body, user.token);
    if (res.success) { showToast(t.id ? "Tag atualizada!" : "Tag criada!"); setEditTag(null); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function excluirTag(id) {
    if (!confirm("Remover esta tag?")) return;
    const res = await api("DELETE", `/api/tags/${id}`, null, user.token);
    if (res.success) { showToast("Tag removida."); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function salvarRegra() {
    const r = editRegra;
    const body = {
      tag_id: Number(r.tag_id), tipo: r.tipo,
      dia_semana: r.dia_semana !== "" ? Number(r.dia_semana) : null,
      qnd_ocorre: r.qnd_ocorre ? Number(r.qnd_ocorre) : null,
      mes: r.mes ? Number(r.mes) : null,
      unico_dia: r.unico_dia ? Number(r.unico_dia) : null,
      unico_mes: r.unico_mes ? Number(r.unico_mes) : null,
      unico_ano: r.unico_ano ? Number(r.unico_ano) : null,
      unico_repete_anual: r.unico_repete_anual ? 1 : 0,
      prioridade: r.prioridade ? Number(r.prioridade) : 10,
    };
    const res = r.id ? await api("PUT", `/api/regras/${r.id}`, body, user.token) : await api("POST", "/api/regras", body, user.token);
    if (res.success) { showToast(r.id ? "Regra atualizada!" : "Regra criada!"); setEditRegra(null); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  async function excluirRegra(id) {
    if (!confirm("Remover esta regra?")) return;
    const res = await api("DELETE", `/api/regras/${id}`, null, user.token);
    if (res.success) { showToast("Regra removida."); recarregar(); }
    else showToast(res.message || "Erro.", "error");
  }

  if (loading) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;

  return (
    <div>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="flex gap-2 mb-6">
        {["calendario", "tags", "regras"].map(a => (
          <button key={a} onClick={() => setAba(a)}
            className={"px-4 py-2 rounded-btn text-[0.82rem] font-bold cursor-pointer transition-all border " +
              (aba === a ? "bg-purple text-white border-purple" : "bg-surface-alt text-muted border-line hover:border-purple/40")}>
            {a === "calendario" ? "Calendário" : a === "tags" ? "Tags" : "Regras"}
          </button>
        ))}
      </div>

      {aba === "calendario" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navMes(-1)} className="bg-surface-alt border border-line rounded-btn px-3 py-1.5 cursor-pointer text-muted hover:text-foreground transition-colors">‹</button>
            <span className="font-heading font-bold text-base">{MESES[mes - 1]} {ano}</span>
            <button onClick={() => navMes(1)} className="bg-surface-alt border border-line rounded-btn px-3 py-1.5 cursor-pointer text-muted hover:text-foreground transition-colors">›</button>
          </div>
          <CalendarGrid eventosPorData={eventosPorData} />
        </div>
      )}

      {aba === "tags" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg">Tags do Calendário</h3>
            <Button size="sm" onClick={() => setEditTag({ id: null, nome: "", label: "", cor: "#6c5ce7", aceita_agendamento: true, info: "" })}>
              <FiPlus size={14} /> Nova Tag
            </Button>
          </div>
          {tags.length === 0 ? (
            <p className="text-muted text-center py-10">Nenhuma tag cadastrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tags.map(t => (
                <div key={t.id} className="bg-surface border border-line rounded-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: t.cor }} />
                    <span className="font-bold text-[0.9rem]">{t.label}</span>
                    <span className="text-[0.65rem] text-muted ml-auto">{t.aceita_agendamento ? "Aceita agenda" : "Bloqueia dia"}</span>
                  </div>
                  {t.info && <p className="text-[0.78rem] text-muted mb-2">{t.info}</p>}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditTag(t)}><FiEdit2 size={12} /></Button>
                    <Button variant="danger" size="sm" onClick={() => excluirTag(t.id)}><FiTrash2 size={12} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editTag && (
            <Modal onClose={() => setEditTag(null)} maxWidth={440}>
              <div className="px-7 pt-7 pb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-lg">{editTag.id ? "Editar Tag" : "Nova Tag"}</h3>
                  <button onClick={() => setEditTag(null)} className="text-muted hover:text-foreground bg-none border-none cursor-pointer"><FiX size={18} /></button>
                </div>
                <div className="flex flex-col gap-3">
                  <Input label="Nome (slug)" value={editTag.nome} onChange={e => setEditTag(p => ({ ...p, nome: e.target.value }))} placeholder="fechado" />
                  <Input label="Label" value={editTag.label} onChange={e => setEditTag(p => ({ ...p, label: e.target.value }))} placeholder="Fechado" />
                  <Input label="Cor" type="color" value={editTag.cor} onChange={e => setEditTag(p => ({ ...p, cor: e.target.value }))} />
                  <label className="flex items-center gap-2 cursor-pointer text-[0.85rem]">
                    <input type="checkbox" checked={editTag.aceita_agendamento} onChange={e => setEditTag(p => ({ ...p, aceita_agendamento: e.target.checked }))} className="accent-purple" />
                    Aceita agendamentos neste dia
                  </label>
                  <Input label="Descrição" value={editTag.info || ""} onChange={e => setEditTag(p => ({ ...p, info: e.target.value }))} placeholder="Opcional" />
                  <div className="flex gap-3 mt-2">
                    <Button onClick={salvarTag}><FiSave size={14} /> Salvar</Button>
                    <Button variant="ghost" onClick={() => setEditTag(null)}>Cancelar</Button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {aba === "regras" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-heading font-bold text-lg">Regras de Calendário</h3>
            <Button size="sm" onClick={() => setEditRegra({ id: null, tag_id: "", tipo: "padrao", dia_semana: "", qnd_ocorre: "", mes: "", unico_dia: "", unico_mes: "", unico_ano: "", unico_repete_anual: false, prioridade: 10 })}>
              <FiPlus size={14} /> Nova Regra
            </Button>
          </div>
          {regras.length === 0 ? (
            <p className="text-muted text-center py-10">Nenhuma regra cadastrada.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {regras.map(r => {
                const tag = tags.find(t => t.id === r.tag_id);
                return (
                  <div key={r.id} className="bg-surface border border-line rounded-card p-4 flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tag?.cor || "#888" }} />
                    <div className="flex-1">
                      <div className="font-bold text-[0.9rem]">{tag?.label || "Tag removida"}</div>
                      <div className="text-[0.72rem] text-muted">
                        {r.tipo}
                        {r.dia_semana !== null && r.dia_semana !== undefined && ` · ${DIAS_SEMANA[r.dia_semana]}`}
                        {r.qnd_ocorre && ` · ${r.qnd_ocorre}ª ocorrência`}
                        {r.unico_dia && ` · Dia ${r.unico_dia}/${r.unico_mes || "*"}/${r.unico_ano || "*"}`}
                        {` · Prioridade ${r.prioridade}`}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditRegra(r)}><FiEdit2 size={12} /></Button>
                      <Button variant="danger" size="sm" onClick={() => excluirRegra(r.id)}><FiTrash2 size={12} /></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {editRegra && (
            <Modal onClose={() => setEditRegra(null)} maxWidth={500}>
              <div className="px-7 pt-7 pb-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-lg">{editRegra.id ? "Editar Regra" : "Nova Regra"}</h3>
                  <button onClick={() => setEditRegra(null)} className="text-muted hover:text-foreground bg-none border-none cursor-pointer"><FiX size={18} /></button>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">Tag</label>
                    <select value={editRegra.tag_id} onChange={e => setEditRegra(p => ({ ...p, tag_id: e.target.value }))}
                      className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
                      <option value="">Selecione...</option>
                      {tags.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">Tipo</label>
                    <select value={editRegra.tipo} onChange={e => setEditRegra(p => ({ ...p, tipo: e.target.value }))}
                      className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
                      <option value="padrao">Padrão (repete sempre)</option>
                      <option value="excecao">Exceção (sobrepõe padrão)</option>
                      <option value="unico">Único (uma vez)</option>
                    </select>
                  </div>
                  {editRegra.tipo === "padrao" && (
                    <div>
                      <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">Dia da Semana</label>
                      <select value={editRegra.dia_semana} onChange={e => setEditRegra(p => ({ ...p, dia_semana: e.target.value }))}
                        className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
                        <option value="">Selecione...</option>
                        {DIAS_SEMANA.map((d, i) => <option key={i} value={i}>{d}</option>)}
                      </select>
                    </div>
                  )}
                  {editRegra.tipo === "excecao" && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Ocorrência (1ª, 2ª...)" type="number" value={editRegra.qnd_ocorre} onChange={e => setEditRegra(p => ({ ...p, qnd_ocorre: e.target.value }))} />
                      <Input label="Mês (1-12)" type="number" value={editRegra.mes} onChange={e => setEditRegra(p => ({ ...p, mes: e.target.value }))} />
                    </div>
                  )}
                  {editRegra.tipo === "unico" && (
                    <div className="grid grid-cols-3 gap-3">
                      <Input label="Dia" type="number" value={editRegra.unico_dia} onChange={e => setEditRegra(p => ({ ...p, unico_dia: e.target.value }))} />
                      <Input label="Mês" type="number" value={editRegra.unico_mes} onChange={e => setEditRegra(p => ({ ...p, unico_mes: e.target.value }))} />
                      <Input label="Ano" type="number" value={editRegra.unico_ano} onChange={e => setEditRegra(p => ({ ...p, unico_ano: e.target.value }))} />
                      <label className="flex items-center gap-2 cursor-pointer text-[0.85rem] col-span-3">
                        <input type="checkbox" checked={editRegra.unico_repete_anual} onChange={e => setEditRegra(p => ({ ...p, unico_repete_anual: e.target.checked }))} className="accent-purple" />
                        Repete todo ano
                      </label>
                    </div>
                  )}
                  <Input label="Prioridade (0-255)" type="number" value={editRegra.prioridade} onChange={e => setEditRegra(p => ({ ...p, prioridade: e.target.value }))} />
                  <div className="flex gap-3 mt-2">
                    <Button onClick={salvarRegra}><FiSave size={14} /> Salvar</Button>
                    <Button variant="ghost" onClick={() => setEditRegra(null)}>Cancelar</Button>
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}
