import { useState } from 'react';
import CalendarGrid from '@/components/shared/CalendarGrid';

const ags = [
  { id:1, cliente:'Maria Silva', servico:'Corte + Escova', horario:'09:00', status:'confirmado' },
  { id:2, cliente:'João Santos', servico:'Barba', horario:'10:30', status:'confirmado' },
  { id:3, cliente:'Ana Costa', servico:'Manicure', horario:'14:00', status:'pendente' },
];
const scfg = { confirmado:{ bg:'bg-green-500/15', tx:'text-green-400', l:'Confirmado' }, pendente:{ bg:'bg-amber-500/15', tx:'text-amber-400', l:'Pendente' } };

export default function AgendamentosEmpresa() {
  const [aba, setAba] = useState('hoje');
  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Agendamentos</h1><p className="text-[0.85rem] text-[#7c819a]">Visualize e gerencie</p></div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-0 mb-5 border-b border-[#2a2f42]">
            {['hoje','semana','todos'].map(a => <button key={a} onClick={()=>setAba(a)} className={'py-2.5 px-5 text-[0.85rem] font-semibold cursor-pointer border-b-2 bg-none capitalize transition-all ' + (aba===a ? 'text-[#8b9eff] border-[#5b6cff]' : 'text-[#7c819a] border-transparent')}>{a}</button>)}
          </div>
          <div className="flex flex-col gap-3">
            {ags.map(ag => { const c = scfg[ag.status]; return (
              <div key={ag.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 flex items-center justify-between hover:border-[#3a3f55] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1a1e29] border border-[#2a2f42] flex items-center justify-center text-xl">👤</div>
                  <div><h4 className="text-[0.9rem] font-bold text-[#e8eaf2]">{ag.cliente}</h4><p className="text-[0.78rem] text-[#7c819a]">{ag.servico} • {ag.horario}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={c.bg + ' ' + c.tx + ' text-[0.7rem] font-bold uppercase tracking-wide py-1 px-2.5 rounded-full'}>{c.l}</span>
                  <button className="py-2 px-3 rounded-lg cursor-pointer font-semibold text-[0.8rem] bg-[#5b6cff] text-white border-none hover:bg-[#4a5be8]">Confirmar</button>
                </div>
              </div>
            ); })}
          </div>
        </div>
        <div className="hidden lg:block w-[280px] flex-shrink-0"><CalendarGrid /></div>
      </div>
    </div>
  );
}
