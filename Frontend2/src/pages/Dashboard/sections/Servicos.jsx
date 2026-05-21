import { useState } from 'react';

export default function Servicos() {
  const [sv] = useState([
    { id:1, nome:'Corte + Escova Premium', cat:'Cabelo', preco:85, dur:'60 min', ativo:true },
    { id:2, nome:'Massagem Relaxante', cat:'Spa', preco:120, dur:'90 min', ativo:true },
    { id:3, nome:'Manicure Completa', cat:'Unhas', preco:45, dur:'45 min', ativo:false },
  ]);
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Serviços</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie seus serviços</p></div>
        <button className="py-2.5 px-5 rounded-lg cursor-pointer font-bold text-[0.85rem] bg-[#5b6cff] text-white border-none hover:bg-[#4a5be8] transition-all">+ Novo Serviço</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sv.map(s => (
          <div key={s.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl overflow-hidden hover:border-[#3a3f55] transition-all">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className={'text-[0.63rem] font-bold uppercase tracking-wide py-1 px-2.5 rounded-full ' + (s.ativo ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')}>{s.ativo ? 'Ativo' : 'Inativo'}</span>
                <span className="text-[0.73rem] text-[#7c819a]">{s.cat}</span>
              </div>
              <h4 className="text-[0.95rem] font-bold text-[#e8eaf2] mb-1">{s.nome}</h4>
              <div className="flex items-center gap-4 text-[0.78rem] text-[#7c819a]"><span>💰 R$ {s.preco.toFixed(2)}</span><span>🕐 {s.dur}</span></div>
            </div>
            <div className="px-5 py-3 border-t border-[#2a2f42] flex gap-2">
              <button className="flex-1 py-2 px-3 rounded-lg cursor-pointer font-semibold text-[0.8rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42] hover:bg-[#222636]">Editar</button>
              <button className="py-2 px-3 rounded-lg cursor-pointer font-semibold text-[0.8rem] bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20">{s.ativo ? 'Desativar' : 'Ativar'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
