import { useState, useEffect } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import api from "@/services/api";

export default function PerfilEmpresa({ token, user, showToast }) {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [f, setF] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("GET", "/api/empresa/perfil", null, token).then(res => {
      if (res.success) { setPerfil(res.data); setF(res.data); }
    });
  }, [token]);

  async function salvar() {
    setLoading(true);
    const res = await api("PUT", "/api/empresa/perfil", f, token);
    setLoading(false);
    if (res.success) { showToast("Perfil atualizado!"); setEditando(false); setPerfil({ ...perfil, ...f }); }
    else showToast(res.message || "Erro ao salvar.", "error");
  }

  if (!perfil) return <div className="text-center py-10 text-muted">Carregando...</div>;

  return (
    <div className="max-w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-heading font-black text-xl mb-1">Perfil da Empresa</h2>
          <p className="text-muted text-[0.85rem]">Dados cadastrais e configurações</p>
        </div>
        {!editando && <Button onClick={() => setEditando(true)}>✏️ Editar</Button>}
      </div>

      <div className="bg-surface border border-line rounded-card p-6">
        {editando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome Fantasia" value={f.nome_fantasia || ""} onChange={e => setF(p => ({ ...p, nome_fantasia: e.target.value }))} />
            <Input label="Razão Social" value={f.razao_social || ""} onChange={e => setF(p => ({ ...p, razao_social: e.target.value }))} />
            <Input label="Telefone" value={f.telefone || ""} onChange={e => setF(p => ({ ...p, telefone: e.target.value }))} />
            <Input label="Cidade" value={f.cidade || ""} onChange={e => setF(p => ({ ...p, cidade: e.target.value }))} />
            <Input label="Estado" value={f.estado || ""} onChange={e => setF(p => ({ ...p, estado: e.target.value }))} />
            <Input label="Nicho" value={f.nicho || ""} onChange={e => setF(p => ({ ...p, nicho: e.target.value }))} />
            <Input label="Sub-nicho" value={f.sub_nicho || ""} onChange={e => setF(p => ({ ...p, sub_nicho: e.target.value }))} />
            <div className="md:col-span-2">
              <Textarea label="Descrição" value={f.descricao || ""} onChange={e => setF(p => ({ ...p, descricao: e.target.value }))} rows={4} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button loading={loading} onClick={salvar}>💾 Salvar</Button>
              <Button variant="ghost" onClick={() => setEditando(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {[["Nome Fantasia", perfil.nome_fantasia], ["Razão Social", perfil.razao_social], ["CNPJ", perfil.cnpj], ["E-mail", user?.email], ["Telefone", perfil.telefone], ["Cidade", perfil.cidade], ["Estado", perfil.estado], ["Nicho", perfil.nicho], ["Sub-nicho", perfil.sub_nicho]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-line last:border-0">
                <span className="text-muted text-[0.82rem]">{k}</span>
                <span className="font-semibold text-[0.88rem]">{v || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
