import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Spinner, Toast } from "@/components/ui";
import ScoreRing from "@/components/ui/ScoreRing";
import { formatDate } from "@/utils/formatters";
import { maskPhone } from "@/utils/masks";
import api from "@/services/api";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

export default function PerfilCliente() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [score, setScore] = useState([]);
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  useEffect(() => {
    Promise.all([
      api("GET", "/api/cliente/perfil", null, user.token),
      api("GET", "/api/cliente/score", null, user.token),
    ]).then(([pRes, sRes]) => {
      if (pRes.success) {
        setPerfil(pRes.data);
        setF({ nome: pRes.data.nome || "", telefone: pRes.data.telefone || "", data_nascimento: pRes.data.data_nascimento || "" });
      }
      if (sRes.success) setScore(sRes.data || []);
    });
  }, [user]);

  async function salvar() {
    setLoading(true);
    const res = await api("PUT", "/api/cliente/perfil", f, user.token);
    setLoading(false);
    if (res.success) {
      showToast("Perfil atualizado!");
      setEditando(false);
      setPerfil(p => ({ ...p, ...f }));
    } else {
      showToast(res.message || "Erro ao salvar.", "error");
    }
  }

  if (!perfil) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;

  const campos = [
    ["Nome", perfil.nome],
    ["E-mail", perfil.email],
    ["CPF", perfil.cpf || "—"],
    ["Telefone", perfil.telefone || "—"],
    ["Nascimento", perfil.data_nascimento ? formatDate(perfil.data_nascimento) : "—"],
  ];

  return (
    <div className="max-w-[800px]">
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-black text-xl mb-1">Meu Perfil</h2>
          <p className="text-muted text-[0.85rem]">Gerencie seus dados e acompanhe seu score</p>
        </div>
        {!editando && (
          <Button onClick={() => setEditando(true)}>
            <FiEdit2 size={14} /> Editar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-line rounded-card p-6">
          {editando ? (
            <div className="flex flex-col gap-4">
              <Input label="Nome" value={f.nome} onChange={e => setF(p => ({ ...p, nome: e.target.value }))} />
              <Input label="Telefone" value={f.telefone} onChange={e => setF(p => ({ ...p, telefone: maskPhone(e.target.value) }))} />
              <Input label="Data de Nascimento" type="date" value={f.data_nascimento} onChange={e => setF(p => ({ ...p, data_nascimento: e.target.value }))} />
              <div className="flex gap-3">
                <Button disabled={loading} onClick={salvar}>
                  {loading ? <><Spinner size={14} /> Salvando...</> : <><FiSave size={14} /> Salvar</>}
                </Button>
                <Button variant="ghost" onClick={() => { setEditando(false); setF({ nome: perfil.nome, telefone: perfil.telefone || "", data_nascimento: perfil.data_nascimento || "" }); }}>
                  <FiX size={14} /> Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {campos.map(([k, v]) => (
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
          <p className="text-muted text-[0.78rem] mt-3 mb-5">Score AgendaTech</p>
          {score.length > 0 && (
            <div className="w-full">
              <div className="text-[0.68rem] text-muted uppercase tracking-wider mb-2">Histórico</div>
              <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
                {score.slice(0, 10).map((s, i) => (
                  <div key={i} className="text-[0.75rem] flex justify-between">
                    <span className="text-muted-light truncate flex-1">{s.motivo}</span>
                    <span className={"font-bold ml-2 " + (s.variacao > 0 ? "text-success" : "text-danger")}>
                      {s.variacao > 0 ? "+" : ""}{s.variacao}
                    </span>
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
