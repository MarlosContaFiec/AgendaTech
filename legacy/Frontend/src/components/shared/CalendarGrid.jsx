import { useState } from "react";

const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DSEM = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export default function CalendarGrid({ eventosPorData = {}, onSelectDia }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSel, setDiaSel] = useState(null);

  const pDia = new Date(ano, mes, 1).getDay();
  const diasMes = new Date(ano, mes + 1, 0).getDate();
  const cells = Array(pDia).fill(null).concat(Array.from({ length: diasMes }, (_, i) => i + 1));
  while (cells.length % 7 !== 0) cells.push(null);

  function ds(d) { return ano + "-" + String(mes+1).padStart(2,"0") + "-" + String(d).padStart(2,"0"); }
  function nav(dir) { let nm = mes+dir, na = ano; if(nm<0){nm=11;na--} if(nm>11){nm=0;na++} setMes(nm);setAno(na);setDiaSel(null); }

  return (
    <div className="bg-surface border border-line rounded-card p-4 max-w-[360px]">
      <div className="flex justify-between items-center mb-3.5">
        <button onClick={() => nav(-1)} className="bg-none border-none text-muted text-xl cursor-pointer px-2">‹</button>
        <span className="font-heading font-black text-[0.9rem]">{MESES_FULL[mes]} {ano}</span>
        <button onClick={() => nav(1)} className="bg-none border-none text-muted text-xl cursor-pointer px-2">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1.5">
        {DSEM.map(d => <div key={d} className="text-center text-[0.62rem] text-muted font-bold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dia, i) => {
          if (!dia) return <div key={i} />;
          const d = ds(dia), evs = eventosPorData[d] || [];
          const isH = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
          const isS = dia === diaSel;
          return (
            <div key={i} onClick={() => { const n = dia === diaSel ? null : dia; setDiaSel(n); onSelectDia?.(n ? ds(n) : null); }}
              className={"aspect-square flex flex-col items-center justify-center rounded-md cursor-pointer transition-all border " +
                (isS ? "bg-purple border-transparent" : isH ? "bg-purple/20 border-purple/40" : evs.length > 0 ? "bg-purple/7 border-transparent" : "border-transparent")}>
              <span className={"text-[0.75rem] " + (isS ? "text-white font-bold" : isH ? "text-purple font-bold" : evs.length > 0 ? "text-foreground font-bold" : "text-muted")}>{dia}</span>
              {evs.length > 0 && <div className="flex gap-0.5 mt-0.5">{Array.from({length:Math.min(evs.length,3)}).map((_,j) => <div key={j} className="w-1 h-1 rounded-full" style={{background:isS?"white":"#6c5ce7"}} />)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
