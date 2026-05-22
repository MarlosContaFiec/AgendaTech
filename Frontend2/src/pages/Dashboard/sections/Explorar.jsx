import { useState, useEffect, useMemo } from 'react';
import { apiListarEmpresas, apiListarNichos } from '@/services/empresas';

function Card({ emp }) {
  return (
    <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl overflow-hidden flex flex-col transition-all hover:border-[#3a3f55]">
      <div className="px-4 py-4 border-b border-[#2a2f42]">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[0.73rem] text-[#7c819a]">{emp.cidade || 'Cidade'}</span>
          {emp.media_avaliacao && (
            <div className="flex items-center gap-1">
              <span className="material-icons-outlined text-amber-400" style={{ fontSize: 14 }}>star</span>
              <span className="text-[0.76rem] font-bold text-[#e8eaf2]">{Number(emp.media_avaliacao).toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="font-bold text-[0.95rem] mb-1">{emp.nome_fantasia}</div>
        <div className="text-[0.76rem] text-[#7c819a]">{emp.nicho || emp.sub_nicho || 'Serviço'}</div>
      </div>
      <div className="px-4 py-3 border-t border-[#2a2f42] flex gap-2">
        <button className="py-[9px] px-4 rounded-lg font-semibold text-[0.82rem] bg-[#1a1e29] text-[#e8eaf2] border border-[#2a2f42] hover:bg-[#222636] transition-all">Detalhes</button>
        <button className="py-[9px] px-4 rounded-lg font-bold text-[0.82rem] bg-[#5b6cff] text-white border-none flex-1 hover:bg-[#4a5be8] transition-all">Agendar</button>
      </div>
    </div>
  );
}

export default function Explorar() {
  const [busca, setBusca] = useState('');
  const [cidade, setCidade] = useState('');
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoad(true);
      const params = {};
      if (busca) params.busca = busca;
      if (cidade) params.cidade = cidade;
      const res = await apiListarEmpresas(params);
      if (res.success) setItems(res.data || []);
      setLoad(false);
    }
    const t = setTimeout(carregar, 400);
    return () => clearTimeout(t);
  }, [busca, cidade]);

  const cidades = [...new Set(items.map(e => e.cidade).filter(Boolean))];

  return (
    <div className="animate-fadeUp">
      <div className="mb-6">
        <h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Explorar</h1>
        <p className="text-[0.85rem] text-[#7c819a]">Encontre empresas e serviços</p>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <input placeholder="🔍 Buscar..." value={busca} onChange={e => setBusca(e.target.value)}
          className="flex-1 min-w-[200px] bg-[#1a1e29] border border-[#2a2f42] py-2.5 px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none focus:border-[#5b6cff] transition-colors" />
        <select value={cidade} onChange={e => setCidade(e.target.value)}
          className="bg-[#1a1e29] border border-[#2a2f42] py-[9px] px-3 rounded-lg text-[0.85rem] text-[#e8eaf2] outline-none">
          <option value="">Todas cidades</option>
          {cidades.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {load ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#7c819a]"><span className="material-icons-outlined" style={{ fontSize: 48 }}>search_off</span><p className="mt-2">Nenhuma empresa encontrada.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{items.map(emp => <Card key={emp.id} emp={emp} />)}</div>
      )}
    </div>
  );
}
