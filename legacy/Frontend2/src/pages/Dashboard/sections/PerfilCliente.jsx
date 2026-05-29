import { useState, useEffect } from 'react';
import { apiPerfilCliente, apiAtualizarPerfilCliente } from '@/services/cliente';
import { Input } from '@/components/ui/Input';
import { BotaoPrimario } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function PerfilCliente() {
  const [p, setP] = useState(null);
  const [load, setLoad] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    async function carregar() {
      const res = await apiPerfilCliente();
      if (res.success) setP(res.data);
      setLoad(false);
    }
    carregar();
  }, []);

  function upd(k, v) { setP(prev => ({ ...prev, [k]: v })); }

  async function salvar() {
    const res = await apiAtualizarPerfilCliente({ nome: p.nome, telefone: p.telefone, alergias: p.alergias });
    if (res.success) setToast('Perfil atualizado!'); else setToast('Erro ao salvar.');
    setTimeout(() => setToast(''), 3000);
  }

  if (load || !p) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Meu Perfil</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie suas informações</p></div>
      <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6 max-w-[600px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5b6cff] to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{(p.nome||'U').charAt(0)}</div>
          <div><h3 className="text-[1.05rem] font-bold text-[#e8eaf2]">{p.nome}</h3><p className="text-[0.78rem] text-[#7c819a]">{p.email}</p></div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Nome" value={p.nome||''} onChange={e => upd('nome',e.target.value)} obrigatorio />
          <Input label="E-mail" value={p.email||''} disabled className="opacity-60 cursor-not-allowed" />
          <Input label="CPF" value={p.cpf||''} disabled className="opacity-60 cursor-not-allowed" />
          <Input label="Telefone" value={p.telefone||''} onChange={e => upd('telefone',e.target.value)} />
          <Input label="Alergias / Observações" value={p.alergias||''} onChange={e => upd('alergias',e.target.value)} />
        </div>
        <div className="mt-6"><BotaoPrimario onClick={salvar}>Salvar Alterações</BotaoPrimario></div>
      </div>
      <Toast msg={toast} type="success" />
    </div>
  );
}
