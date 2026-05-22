import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiDashboardEmpresa } from '@/services/empresa';

export default function VisaoGeral() {
  const { usuario } = useAuth();
  const emp = usuario?.tipo === 'empresa';
  const [dash, setDash] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    async function carregar() {
      if (emp) {
        const res = await apiDashboardEmpresa();
        if (res.success) setDash(res.data);
      }
      setLoad(false);
    }
    carregar();
  }, [emp]);

  if (load) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>;

  const statsEmpresa = dash ? [
    { l:'Agendamentos', v: String(dash.total_agendamentos || 0), i:'calendar_month', c:'text-tb-accent' },
    { l:'Pendentes', v: String(dash.pendentes || 0), i:'schedule', c:'text-tb-amber' },
    { l:'Clientes', v: String(dash.total_clientes || 0), i:'group', c:'text-tb-green' },
    { l:'Receita', v: `R$ ${(dash.receita_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, i:'payments', c:'text-tb-violet' },
  ] : [];
  const statsCliente = [
    { l:'Agendamentos Ativos', v:'3', i:'calendar_month', c:'text-tb-accent' },
    { l:'Serviços Concluídos', v:'12', i:'check_circle', c:'text-tb-green' },
    { l:'Score', v:'450', i:'star', c:'text-tb-amber' },
  ];
  const stats = emp ? statsEmpresa : statsCliente;

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Visão Geral</h1>
        <p className="text-[0.85rem] text-[#7c819a]">{emp ? 'Resumo do negócio' : 'Seu resumo pessoal'}</p>
      </div>
      <div className={`grid gap-4 mb-8 ${emp ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {stats.map((s, i) => (
          <div key={i} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 hover:border-[#3a3f55] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="material-icons-outlined" style={{ fontSize: 28 }}>{s.i}</span>
              <span className={`text-2xl font-extrabold ${s.c}`}>{s.v}</span>
            </div>
            <span className="text-[0.78rem] text-[#7c819a]">{s.l}</span>
          </div>
        ))}
      </div>
      {emp && dash?.media_avaliacao && (
        <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <span className="material-icons-outlined text-amber-400" style={{ fontSize: 24 }}>star</span>
            <span className="text-2xl font-extrabold text-[#e8eaf2]">{Number(dash.media_avaliacao).toFixed(1)}</span>
            <span className="text-[0.85rem] text-[#7c819a]">média de avaliações</span>
          </div>
        </div>
      )}
    </div>
  );
}
