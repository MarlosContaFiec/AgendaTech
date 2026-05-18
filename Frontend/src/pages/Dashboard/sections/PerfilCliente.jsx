import { useState, useEffect } from "react";
import { Button, Input, Alert } from "@/components/ui";
import ScoreRing from "@/components/ui/ScoreRing";
import { formatDate } from "@/utils/formatters";
import { maskPhone } from "@/utils/masks";
import api from "@/services/api";

export default function PerfilCliente({ token, user, showToast }) {
  const [perfil, setPerfil] = useState(null);
  const [score, setScore] = useState([]);
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api("GET", "/api/cliente/perfil", null, token),
      api("GET", "/api/cliente/score", null, token),
    ]).then(([pRes, sRes]) => {
      if (pRes.success) { setPerfil(pRes.data); setF({ nome: pRes.data.nome || "", telefone: pRes.data.telefone || "", data_nascimento: pRes.data.data_nascimento || "" }); }
      if (sRes.success) setScore(sRes.data || []);
    });
  }, [token]);

  async function salvar() {
    setLoading(true);
    const res = await api("PUT", "/api/cliente/perfil", f, token);
    setLoading(false);
    if (res.success) { showToast("Perfil atualizado!"); setEditando(false); setPerfil(p => ({ ...p, ...f })); }
    else showToast(res.message || "Erro ao salvar.", "error");
  }

  if (!perfil) return <div className="text-center py-10 text-muted">Carregando...</div>;

  return (
    <div className="max-w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-black text-xl mb-1">Meu Perfil</h2>
          <p className="text-muted text-[0.85rem]">Gerencie seus dados e acompanhe seu score</p>
        </div>
        {!editando && <Button onClick={() => setEditando(true)}>✏️ Editar</Button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-line rounded-card p-6">
          {editando ? (
            <div className="flex flex-col gap-4">
              <Input label="Nome" value={f.nome} onChange={e => setF(p => ({ ...p, nome: e.target.value }))} />
              <Input label="Telefone" value={f.telefone} onChange={e => setF(p => ({ ...p, telefone: maskPhone(e.target.value) }))} />
              <Input label="Data de Nascimento" type="date" value={f.data_nascimento} onChange={e => setF(p => ({ ...p, data_nascimento: e.target.value }))} />
              <div className="flex gap-3">
                <Button loading={loading} onClick={salvar}>💾 Salvar</Button>
                <Button variant="ghost" onClick={() => setEditando(false)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {[["Nome", perfil.nome], ["E-mail", perfil.email], ["CPF", perfil.cpf || "—"], ["Telefone", perfil.telefone || "—"], ["Nascimento", perfil.data_nascimento ? formatDate(perfil.data_nascimento) : "—"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-line last:border-0">
                  <span className="text-muted text-[0.82rem]">{k}</span>
                  <span className="font-semibold text-[0.88rem]">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-line rounded-card p-6 flex flex-col items-center">
          <ScoreRing score={Math.round(perfil.score || 100)} size={100} />
          <p className="text-muted text-[0.78rem] mt-3 mb-5">Score TrustBook</p>
          {score.length > 0 && (
            <div className="w-full">
              <div className="text-[0.68rem] text-muted uppercase tracking-wider mb-2">Histórico</div>
              <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
                {score.slice(0, 10).map((s, i) => (
                  <div key={i} className="text-[0.75rem] flex justify-between">
                    <span className="text-muted-light truncate flex-1">{s.motivo}</span>
                    <span className={"font-bold ml-2 " + (s.variacao > 0 ? "text-success" : "text-danger")}>{s.variacao > 0 ? "+" : ""}{s.variacao}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
