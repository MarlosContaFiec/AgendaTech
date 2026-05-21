import { useState, useMemo } from 'react';
import { formatDate } from '@/utils/formatters';
import { lotColorHex } from '@/utils/calculators';
import { BadgeClassif, BadgePublico, BadgeInscricao, BadgeFull } from '@/components/ui/Badge';

const EVENTOS = [
  { id:1, titulo:"Corte + Escova Premium", estabelecimento:"Salão Lumière", tipo:"Salão", estado:"SP", cidade:"Indaiatuba", desc:"Corte personalizado + escova modeladora.", horarios:["09:00","11:00","14:00","16:30"], data:"2026-05-15", publico:false, lotacao:8, classificacao:"livre", inscritos:[] },
  { id:2, titulo:"Workshop Bem-Estar Mental", estabelecimento:"Clínica Equilíbrio", tipo:"Clínica", estado:"SP", cidade:"Indaiatuba", desc:"Palestra gratuita sobre saúde mental.", horarios:["10:00"], data:"2026-05-20", publico:true, lotacao:null, classificacao:"livre", inscritos:[] },
  { id:3, titulo:"Avaliação Física Completa", estabelecimento:"Academia Iron", tipo:"Academia", estado:"SP", cidade:"Campinas", desc:"Avaliação com análise de composição corporal.", horarios:["07:00","08:00","17:00","18:00"], data:"2026-05-28", publico:false, lotacao:10, classificacao:"12", inscritos:[] },
  { id:4, titulo:"Noite Eletrônica", estabelecimento:"Club Vibe", tipo:"Estúdio", estado:"SP", cidade:"São Paulo", desc:"Festa eletrônica com DJs internacionais.", horarios:["22:00","00:00"], data:"2026-06-07", publico:false, lotacao:200, classificacao:"18", inscritos:[], preco:120 },
  { id:5, titulo:"Dia de Spa Completo", estabelecimento:"Spa Serenità", tipo:"Spa", estado:"SP", cidade:"Indaiatuba", desc:"Massagem + aromaterapia + esfoliação.", horarios:["10:00","14:00"], data:"2026-05-22", publico:false, lotacao:4, classificacao:"livre", inscritos:[], preco:280 },
];

function Card({ ev }) {
  const lot = ev.inscritos?.length || 0;
  const full = ev.lotacao !== null && lot >= ev.lotacao;
  const pct = ev.lotacao ? lot / ev.lotacao : 0;
  return (
    <div className={'bg-[#13161e] border border-[#2a2f42] rounded-xl overflow-hidden flex flex-col transition-all hover:border-[#3a3f55] ' + (full && !ev.publico ? 'opacity-45 grayscale-[0.4]' : '')}>
      <div className="px-4 py-4 border-b border-[#2a2f42]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-1.5 flex-wrap">{full ? <BadgeFull /> : ev.publico ? <BadgePublico /> : <BadgeInscricao />}<BadgeClassif val={ev.classificacao} /></div>
          <span className="text-[0.73rem] text-[#7c819a]">{ev.cidade} · {ev.estado}</span>
        </div>
        <div className="font-bold text-[0.95rem] mb-1">{ev.titulo}</div>
        <div className="text-[0.76rem] text-[#7c819a]">📍 {ev.estabelecimento} · {ev.tipo}</div>
        {ev.preco && <div className="text-[0.76rem] text-green-400 font-bold mt-1">💰 R$ {ev.preco.toFixed(2)}</div>}
      </div>
      <div className="px-4 py-3.5 flex-1">
        <p className="text-[0.81rem] text-[#7c819a] leading-relaxed mb-3 line-clamp-2">{ev.desc}</p>
        <div className="text-[0.7rem] text-[#7c819a] mb-1.5">📅 {formatDate(ev.data)}</div>
        <div className="flex flex-wrap gap-1.5 mb-3">{ev.horarios.map(h => <span key={h} className="text-[0.73rem] bg-[#1a1e29] border border-[#2a2f42] py-[3px] px-[9px] rounded-md">{h}</span>)}</div>
        {ev.lotacao && <div><div className="flex justify-between mb-1"><span className="text-[0.72rem] text-[#7c819a]">Lotação</span><span style={{color:lotColorHex(pct)}} className="text-[0.76rem] font-bold">{lot}/{ev.lotacao}</span></div><div className="h-1 bg-[#2a2f42] rounded-full overflow-hidden"><div style={{width:Math.min(pct*100,100)+'%',background:lotColorHex(pct)}} className="h-full rounded-full transition-all" /></div></div>}
      </div>
      <div className="px-4 py-3 border-t border-[#2a2f42] flex gap-2">
        <button className="py-[9px] px-4 rounded-lg cursor-pointer font-semibold text-[0.82rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42] hover:bg-[#222636] transition-all">Detalhes</button>
        <button className="py-[9px] px-4 rounded-lg cursor-pointer font-bold text-[0.82rem] bg-[#5b6cff] text-white border-none flex-1 hover:bg-[#4a5be8] transition-all">Inscrever-se</button>
      </div>
    </div>
  );
}

export default function Explorar() {
  const [filtro, setFiltro] = useState('');
  const [cidade, setCidade] = useState('');
  const cidades = [...new Set(EVENTOS.map(e => e.cidade))];
  const fil = useMemo(() => EVENTOS.filter(ev => (!filtro || ev.titulo.toLowerCase().includes(filtro.toLowerCase())) && (!cidade || ev.cidade === cidade)), [filtro, cidade]);
  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Explorar</h1><p className="text-[0.85rem] text-[#7c819a]">Encontre serviços e eventos</p></div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <input type="text" placeholder="🔍 Buscar..." value={filtro} onChange={e => setFiltro(e.target.value)} className="flex-1 min-w-[200px] bg-[#1a1e29] border border-[#2a2f42] py-2.5 px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none focus:border-[#5b6cff] transition-colors" />
        <select value={cidade} onChange={e => setCidade(e.target.value)} className="bg-[#1a1e29] border border-[#2a2f42] py-[9px] px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none cursor-pointer"><option value="">Todas cidades</option>{cidades.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{fil.map(ev => <Card key={ev.id} ev={ev} />)}</div>
      {fil.length === 0 && <div className="text-center py-16 text-[#7c819a]"><span className="text-4xl block mb-4">🔍</span><p>Nenhum serviço encontrado.</p></div>}
    </div>
  );
}
