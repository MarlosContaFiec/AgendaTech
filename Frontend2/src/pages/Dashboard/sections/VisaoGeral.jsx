import { useAuth } from '@/contexts/AuthContext';

export default function VisaoGeral() {
  const { usuario } = useAuth();
  const isEmp = usuario?.tipo === 'empresa';

  const stats = isEmp ? [
    { label:'Agendamentos Hoje', v:'8', ic:'📅', c:'text-tb-accent' },
    { label:'Solicitações Pendentes', v:'3', ic:'📋', c:'text-tb-amber' },
    { label:'Clientes Ativos', v:'47', ic:'👥', c:'text-tb-green' },
    { label:'Receita Mensal', v:'R$ 4.200', ic:'💰', c:'text-tb-violet' },
  ] : [
    { label:'Agendamentos Ativos', v:'3', ic:'📅', c:'text-tb-accent' },
    { label:'Serviços Concluídos', v:'12', ic:'✅', c:'text-tb-green' },
    { label:'Pontos Acumulados', v:'450', ic:'⭐', c:'text-tb-amber' },
  ];

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Visão Geral</h1>
        <p className="text-[0.85rem] text-[#7c819a]">{isEmp ? 'Resumo do negócio' : 'Seu resumo pessoal'}</p>
      </div>
      <div className={'grid gap-4 mb-8 ' + (isEmp ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3')}>
        {stats.map((s, i) => (
          <div key={i} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 hover:border-[#3a3f55] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.ic}</span>
              <span className={'text-2xl font-extrabold ' + s.c}>{s.v}</span>
            </div>
            <span className="text-[0.78rem] text-[#7c819a]">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#e8eaf2] mb-4">{isEmp ? 'Atividade Recente' : 'Próximos Agendamentos'}</h3>
        <div className="flex flex-col gap-3">
          {[
            { t: isEmp ? 'Corte + Escova Premium' : 'Corte — Salão Lumière', d: '15/05/2026 • 14:00', s: 'Confirmado', bg: 'bg-green-500/15', tx: 'text-green-400' },
            { t: isEmp ? 'Aula de Yoga' : 'Avaliação — Academia Iron', d: '20/05/2026 • 10:00', s: 'Pendente', bg: 'bg-amber-500/15', tx: 'text-amber-400' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4 bg-[#1a1e29] rounded-lg border border-[#2a2f42]">
              <div>
                <p className="text-[0.85rem] font-semibold text-[#e8eaf2]">{a.t}</p>
                <p className="text-[0.75rem] text-[#7c819a]">{a.d}</p>
              </div>
              <span className={'text-[0.7rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ' + a.bg + ' ' + a.tx}>{a.s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
