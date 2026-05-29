import { useState } from 'react';
import { MESES, DIAS_SEMANA } from '@/utils/formatters';

export default function CalendarGrid({ eventos = [], onSelectDate }) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const pri = new Date(ano, mes, 1).getDay();
  const total = new Date(ano, mes + 1, 0).getDate();
  const dias = Array.from({ length: pri }, () => null).concat(Array.from({ length: total }, (_, i) => i + 1));

  const datasEv = new Set(eventos.map(ev => ev.data));

  function mudar(d) {
    let m = mes + d, a = ano;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m); setAno(a);
  }

  return (
    <div className="bg-tb-surface border border-tb-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => mudar(-1)} className="bg-none border-none text-tb-muted cursor-pointer text-lg hover:text-tb-text transition-colors">‹</button>
        <span className="text-sm font-bold text-tb-text">{MESES[mes]} {ano}</span>
        <button onClick={() => mudar(1)} className="bg-none border-none text-tb-muted cursor-pointer text-lg hover:text-tb-text transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map(d => <div key={d} className="text-[0.65rem] text-tb-muted font-semibold uppercase pb-1">{d}</div>)}
        {dias.map((dia, i) => {
          if (!dia) return <div key={i} />;
          const ds = ano + '-' + String(mes+1).padStart(2,'0') + '-' + String(dia).padStart(2,'0');
          const ev = datasEv.has(ds);
          const hj = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
          return (
            <button key={i} onClick={() => onSelectDate && onSelectDate(ds)}
              className={
                'w-full aspect-square rounded-lg text-[0.75rem] flex items-center justify-center transition-all duration-150 cursor-pointer border-none relative ' +
                (hj ? 'bg-tb-accent/20 text-tb-accent font-bold ' : 'bg-tb-surface2 text-tb-muted2 hover:bg-tb-surface3 ') +
                (ev ? 'font-bold ' : '')
              }>
              {dia}
              {ev && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-tb-accent" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
