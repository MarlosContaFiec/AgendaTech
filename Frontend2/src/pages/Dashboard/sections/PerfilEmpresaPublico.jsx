export default function PerfilEmpresaPublico({ setSecao }) {
  const e = { nome:'Salão Lumière', tipo:'Salão', av:4.8, avs:124, end:'Rua das Flores, 123 - Centro, Indaiatuba - SP', tel:'(19) 3333-4444', hor:'Seg-Sex: 09:00-19:00 | Sáb: 09:00-14:00', desc:'Salão especializado em cortes modernos e tratamentos capilares.' };
  const sv = [{ n:'Corte + Escova', p:'R$ 85,00', d:'60 min' },{ n:'Coloração', p:'R$ 150,00', d:'120 min' },{ n:'Hidratação', p:'R$ 60,00', d:'45 min' }];
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setSecao && setSecao('perfil')} className="bg-none border-none text-[#7c819a] cursor-pointer text-lg hover:text-[#e8eaf2]">←</button>
        <div><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Perfil Público</h1><p className="text-[0.85rem] text-[#7c819a]">Visualização do cliente</p></div>
      </div>
      <div className="max-w-[700px]">
        <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl overflow-hidden mb-4">
          <div className="h-32 bg-gradient-to-br from-violet-500/30 to-pink-500/20" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-[#13161e]">{e.nome.charAt(0)}</div>
              <div className="pb-1"><h2 className="text-[1.2rem] font-extrabold text-[#e8eaf2]">{e.nome}</h2><p className="text-[0.82rem] text-[#7c819a]">{e.tipo} · {e.end}</p></div>
            </div>
            <div className="flex items-center gap-4 mb-4"><span className="text-amber-400">⭐</span><span className="font-bold text-[#e8eaf2]">{e.av}</span><span className="text-[0.78rem] text-[#7c819a]">({e.avs} avaliações)</span></div>
            <p className="text-[0.85rem] text-[#a0a4ba] leading-relaxed">{e.desc}</p>
            <div className="flex flex-col gap-2 mt-4 text-[0.82rem]">
              <div className="flex items-center gap-2 text-[#7c819a]"><span>📍</span>{e.end}</div>
              <div className="flex items-center gap-2 text-[#7c819a]"><span>📞</span>{e.tel}</div>
              <div className="flex items-center gap-2 text-[#7c819a]"><span>🕐</span>{e.hor}</div>
            </div>
          </div>
        </div>
        <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#e8eaf2] mb-4">Serviços Disponíveis</h3>
          <div className="flex flex-col gap-3">
            {sv.map((s,i) => (
              <div key={i} className="flex items-center justify-between py-3 px-4 bg-[#1a1e29] border border-[#2a2f42] rounded-lg">
                <div><h4 className="text-[0.88rem] font-semibold text-[#e8eaf2]">{s.n}</h4><p className="text-[0.75rem] text-[#7c819a]">{s.d}</p></div>
                <span className="font-bold text-green-400 text-[0.88rem]">{s.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
