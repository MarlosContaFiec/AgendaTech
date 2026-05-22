import { useState, useEffect } from 'react';
import { apiPerfilEmpresa, apiAtualizarPerfilEmpresa } from '@/services/empresa';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { BotaoPrimario } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function PerfilEmpresa({ setSecao }) {
  const [p, setP] = useState(null);
  const [load, setLoad] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function carregar() { const r = await apiPerfilEmpresa(); if (r.success) setP(r.data); setLoad(false); }
    carregar();
  }, []);

  function upd(k, v) { setP(prev => ({ ...prev, [k]: v })); }

  async function salvar() {
    const r = await apiAtualizarPerfilEmpresa({ nome_fantasia: p.nome_fantasia, descricao: p.descricao, cidade: p.cidade, estado: p.estado, nicho: p.nicho });
    if (r.success) setToast('Atualizado!'); else setToast('Erro.');
    setTimeout(() => setToast(''), 3000);
  }

  if (load || !p) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Perfil da Empresa</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie as informações</p></div>
      </div>
      <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6 max-w-[700px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{(p.nome_fantasia||'E').charAt(0)}</div>
          <div><h3 className="text-[1.05rem] font-bold text-[#e8eaf2]">{p.nome_fantasia}</h3><p className="text-[0.78rem] text-[#7c819a]">{p.cnpj}</p></div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Nome Fantasia" value={p.nome_fantasia||''} onChange={e => upd('nome_fantasia',e.target.value)} obrigatorio />
          <Input label="Razão Social" value={p.razao_social||''} disabled className="opacity-60 cursor-not-allowed" />
          <Input label="CNPJ" value={p.cnpj||''} disabled className="opacity-60 cursor-not-allowed" />
          <Input label="Nicho" value={p.nicho||''} onChange={e => upd('nicho',e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cidade" value={p.cidade||''} onChange={e => upd('cidade',e.target.value)} />
            <Input label="Estado" value={p.estado||''} onChange={e => upd('estado',e.target.value)} />
          </div>
          <Textarea label="Descrição" value={p.descricao||''} rows={3} onChange={e => upd('descricao',e.target.value)} />
        </div>
        <div className="mt-6"><BotaoPrimario onClick={salvar}>Salvar Alterações</BotaoPrimario></div>
      </div>
      <Toast msg={toast} type="success" />
    </div>
  );
}
