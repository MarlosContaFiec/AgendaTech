import { useState } from 'react';
import CalendarGrid from '@/components/shared/CalendarGrid';

const ags = [
  { id:1, titulo:'Corte + Escova Premium', local:'Salão Lumière', data:'2026-05-15', horario:'14:00', status:'confirmado' },
  { id:2, titulo:'Avaliação Física', local:'Academia Iron', data:'2026-05-28', horario:'08:00', status:'pendente' },
];
const scfg = { confirmado:{ bg:'bg-green-500/15', tx:'text-green-400', l:'Confirmado' }, pendente:{ bg:'bg-amber-500/15', tx:'text-amber-400', l:'Pendente' } };

export default function MeusAgendamentos() {
  const [aba, setAba] = useState('ativos');
  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Meus Agendamentos</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie seus horários</p></div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-0 mb-6 border-b border-[#2a2f42]">
            {[{id:'ativos',l:'Ativos'},{id:'historico',l:'Histórico'}].map(a => <button key={a.id} onClick={() => setAba(a.id)} className={'py-2.5 px-5 text-[0.85rem] font-semibold cursor-pointer border-b-2 bg-none transition-all ' + (aba===a.id ? 'text-[#8b9eff] border-[#5b6cff]' : 'text-[#7c819a] border-transparent')}>{a.l}</button>)}
          </div>
          <div className="flex flex-col gap-3">
            {ags.map(ag => { const c = scfg[ag.status]; return (
              <div key={ag.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 flex items-center justify-between hover:border-[#3a3f55] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1e29] border border-[#2a2f42] flex items-center justify-center text-xl">📅</div>
                  <div><h4 className="text-[0.9rem] font-bold text-[#e8eaf2]">{ag.titulo}</h4><p className="text-[0.78rem] text-[#7c819a]">{ag.local} · {ag.data} • {ag.horario}</p></div>
                </div>
                <span className={c.bg + ' ' + c.tx + ' text-[0.7rem] font-bold uppercase tracking-wide py-1 px-2.5 rounded-full'}>{c.l}</span>
              </div>
            ); })}
          </div>
        </div>
        <div className="hidden lg:block w-[280px] flex-shrink-0"><CalendarGrid /></div>
      </div>
    </div>
  );
}
