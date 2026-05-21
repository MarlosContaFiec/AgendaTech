import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { BotaoPrimario } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

const CID = { SP:['Indaiatuba','Campinas','São Paulo'], RJ:['Rio de Janeiro','Niterói'], MG:['Belo Horizonte','Uberlândia'] };

export default function PerfilCliente() {
  const [p, setP] = useState({ nome:'Maria Silva', cpf:'123.456.789-00', nascimento:'1995-03-20', estado:'SP', cidade:'Indaiatuba', telefone:'(19) 99999-0000' });
  const [toast, setToast] = useState('');
  function u(k,v) { setP(prev => ({...prev,[k]:v})); }
  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Meu Perfil</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie suas informações</p></div>
      <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6 max-w-[600px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5b6cff] to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{p.nome.charAt(0)}</div>
          <div><h3 className="text-[1.05rem] font-bold text-[#e8eaf2]">{p.nome}</h3><p className="text-[0.78rem] text-[#7c819a]">Cliente desde 2025</p></div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Nome" value={p.nome} onChange={e => u('nome',e.target.value)} obrigatorio />
          <Input label="CPF" value={p.cpf} disabled />
          <Input label="Nascimento" type="date" value={p.nascimento} onChange={e => u('nascimento',e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[0.7rem] font-bold uppercase tracking-[0.07em] mb-[5px] text-[#6b7294] block">Estado</label><select value={p.estado} onChange={e=>{u('estado',e.target.value);u('cidade','');}} className="w-full bg-[#1a1e29] border border-[#2a2f42] py-[9px] px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none cursor-pointer"><option value="SP">SP</option><option value="RJ">RJ</option><option value="MG">MG</option></select></div>
            <div><label className="text-[0.7rem] font-bold uppercase tracking-[0.07em] mb-[5px] text-[#6b7294] block">Cidade</label><select value={p.cidade} onChange={e=>u('cidade',e.target.value)} className="w-full bg-[#1a1e29] border border-[#2a2f42] py-[9px] px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none cursor-pointer">{(CID[p.estado]||[]).map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <Input label="Telefone" value={p.telefone} onChange={e => u('telefone',e.target.value)} />
        </div>
        <div className="mt-6"><BotaoPrimario onClick={() => { setToast('Perfil atualizado!'); setTimeout(()=>setToast(''),3000); }}>Salvar Alterações</BotaoPrimario></div>
      </div>
      <Toast msg={toast} type="success" />
    </div>
  );
}
