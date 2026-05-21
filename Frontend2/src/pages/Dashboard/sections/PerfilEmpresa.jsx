import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { BotaoPrimario } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function PerfilEmpresa({ setSecao }) {
  const [p, setP] = useState({ razao:'Salão Lumière Ltda.', fantasia:'Salão Lumière', cnpj:'12.345.678/0001-90', email:'contato@salonlumiere.com', tel:'(19) 3333-4444', end:'Rua das Flores, 123 - Centro, Indaiatuba - SP', desc:'Salão especializado em cortes modernos.', hor:'Seg-Sex: 09:00-19:00 | Sáb: 09:00-14:00' });
  const [toast, setToast] = useState('');
  function u(k,v) { setP(prev=>({...prev,[k]:v})); }
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Perfil da Empresa</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie as informações</p></div>
        <button onClick={() => setSecao && setSecao('perfil-publico')} className="py-2.5 px-5 rounded-lg cursor-pointer font-semibold text-[0.85rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42] hover:bg-[#222636] transition-all">👁️ Ver Perfil Público</button>
      </div>
      <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6 max-w-[700px]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">{p.fantasia.charAt(0)}</div>
          <div><h3 className="text-[1.05rem] font-bold text-[#e8eaf2]">{p.fantasia}</h3><p className="text-[0.78rem] text-[#7c819a]">{p.cnpj}</p></div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3"><Input label="Razão Social" value={p.razao} onChange={e=>u('razao',e.target.value)} /><Input label="Nome Fantasia" value={p.fantasia} onChange={e=>u('fantasia',e.target.value)} /></div>
          <Input label="CNPJ" value={p.cnpj} disabled />
          <Input label="E-mail" value={p.email} onChange={e=>u('email',e.target.value)} />
          <Input label="Telefone" value={p.tel} onChange={e=>u('tel',e.target.value)} />
          <Input label="Endereço" value={p.end} onChange={e=>u('end',e.target.value)} />
          <Textarea label="Descrição" value={p.desc} rows={3} onChange={e=>u('desc',e.target.value)} />
          <Input label="Horário" value={p.hor} onChange={e=>u('hor',e.target.value)} />
        </div>
        <div className="mt-6"><BotaoPrimario onClick={() => { setToast('Perfil atualizado!'); setTimeout(()=>setToast(''),3000); }}>Salvar Alterações</BotaoPrimario></div>
      </div>
      <Toast msg={toast} type="success" />
    </div>
  );
}
