import { useState } from 'react';

export default function Solicitacoes() {
  const [sols, setSols] = useState([
    { id:1, cliente:'Ana Costa', servico:'Manicure Completa', horario:'14:00', data:'2026-05-15', motivo:'' },
    { id:2, cliente:'Carlos Souza', servico:'Corte + Barba', horario:'16:30', data:'2026-05-15', motivo:'Quero 2 horários seguidos' },
  ]);
  function resp(id) { setSols(p => p.filter(s => s.id !== id)); }
  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Solicitações</h1><p className="text-[0.85rem] text-[#7c819a]">{sols.length} pendentes</p></div>
      {sols.length === 0 ? <div className="text-center py-16 text-[#7c819a]"><span className="text-4xl block mb-4">✅</span><p>Nenhuma solicitação pendente!</p></div> : (
        <div className="flex flex-col gap-3 max-w-[700px]">
          {sols.map(s => (
            <div key={s.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 hover:border-[#3a3f55] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg">⏳</div>
                  <div><h4 className="text-[0.9rem] font-bold text-[#e8eaf2]">{s.cliente}</h4><p className="text-[0.78rem] text-[#7c819a]">{s.servico} · {s.data} · {s.horario}</p></div>
                </div>
              </div>
              {s.motivo && <div className="mb-3 py-2.5 px-3 bg-[#1a1e29] border border-[#2a2f42] rounded-lg"><p className="text-[0.72rem] text-[#7c819a] uppercase tracking-wide mb-1">Justificativa</p><p className="text-[0.82rem] text-[#a0a4ba]">{s.motivo}</p></div>}
              <div className="flex gap-2">
                <button onClick={() => resp(s.id)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer font-bold text-[0.82rem] bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25">✓ Aprovar</button>
                <button onClick={() => resp(s.id)} className="flex-1 py-2.5 px-4 rounded-lg cursor-pointer font-bold text-[0.82rem] bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25">✕ Rejeitar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
