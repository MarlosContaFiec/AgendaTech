import { useState } from 'react';
import { timeAgo } from '@/utils/formatters';

const INIT = [
  { id:1, tipo:'agendamento', titulo:'Novo agendamento', desc:'Maria Silva agendou Corte + Escova para 15/05 às 14:00', tempo:'2026-05-14T10:30:00', lida:false },
  { id:2, tipo:'solicitacao', titulo:'Solicitação pendente', desc:'Carlos Souza solicitou 2 horários', tempo:'2026-05-14T09:15:00', lida:false },
  { id:3, tipo:'cancelamento', titulo:'Cancelamento', desc:'Ana Costa cancelou Manicure (14:00)', tempo:'2026-05-13T18:00:00', lida:true },
];
const cfg = { agendamento:{ ic:'📅', c:'border-tb-accent/30' }, solicitacao:{ ic:'📋', c:'border-tb-amber/30' }, cancelamento:{ ic:'❌', c:'border-tb-red/30' } };

export default function Notificacoes() {
  const [nots, setNots] = useState(INIT);
  const nl = nots.filter(n => !n.lida).length;
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Notificações</h1><p className="text-[0.85rem] text-[#7c819a]">{nl} não lidas</p></div>
        <button onClick={() => setNots(p => p.map(n => ({...n,lida:true})))} className="bg-none border-none text-[0.82rem] text-[#5b6cff] cursor-pointer font-semibold hover:underline">Marcar todas como lidas</button>
      </div>
      <div className="flex flex-col gap-3 max-w-[700px]">
        {nots.map(n => { const c = cfg[n.tipo] || cfg.agendamento; return (
          <div key={n.id} className={'bg-[#13161e] border rounded-xl p-5 flex items-start gap-4 hover:border-[#3a3f55] transition-all ' + (!n.lida ? 'border-l-[3px] ' + c.c : 'border-[#2a2f42]')}>
            <div className="w-10 h-10 rounded-xl bg-[#1a1e29] border border-[#2a2f42] flex items-center justify-center text-lg flex-shrink-0">{c.ic}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1"><h4 className="text-[0.88rem] font-bold text-[#e8eaf2]">{n.titulo}</h4>{!n.lida && <span className="w-2 h-2 rounded-full bg-[#5b6cff]" />}</div>
              <p className="text-[0.82rem] text-[#a0a4ba] leading-relaxed">{n.desc}</p>
              <span className="text-[0.72rem] text-[#7c819a] mt-1 block">{timeAgo(n.tempo)}</span>
            </div>
          </div>
        ); })}
      </div>
    </div>
  );
}
