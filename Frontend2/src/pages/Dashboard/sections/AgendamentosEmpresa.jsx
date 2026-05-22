import { useState, useEffect } from 'react';
import { apiAgendamentosEmpresa, apiAceitarAgendamento, apiRecusarAgendamento, apiConcluirAgendamento } from '@/services/agendamentos';
import { Toast } from '@/components/ui/Toast';

const ST = {
  confirmado: { bg:'bg-green-500/15', t:'text-green-400', l:'Confirmado', i:'check_circle' },
  pendente:   { bg:'bg-amber-500/15', t:'text-amber-400', l:'Pendente',   i:'schedule' },
  concluido:  { bg:'bg-blue-500/15',  t:'text-blue-300',  l:'Concluído',  i:'task_alt' },
  cancelado:  { bg:'bg-red-500/15',   t:'text-red-400',   l:'Cancelado',  i:'cancel' },
};

export default function AgendamentosEmpresa() {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [toast, setToast] = useState('');

  async function carregar() {
    setLoad(true);
    const params = filtro !== 'todos' ? { status: filtro } : {};
    const res = await apiAgendamentosEmpresa(params);
    if (res.success) setItems(res.data || []);
    setLoad(false);
  }
  useEffect(() => { carregar(); }, [filtro]);

  async function aceitar(id) { const r = await apiAceitarAgendamento(id); if (r.success) { setToast('Aceito!'); carregar(); } setTimeout(() => setToast(''), 3000); }
  async function concluir(id) { const r = await apiConcluirAgendamento(id); if (r.success) { setToast('Concluído!'); carregar(); } setTimeout(() => setToast(''), 3000); }
  async function recusar(id) { const r = await apiRecusarAgendamento(id, 'Sem disponibilidade'); if (r.success) { setToast('Recusado.'); carregar(); } setTimeout(() => setToast(''), 3000); }

  if (load) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Agendamentos</h1><p className="text-[0.85rem] text-[#7c819a]">{items.length} agendamentos</p></div>
      <div className="flex gap-0 mb-5 border-b border-[#2a2f42]">
        {['todos','pendente','confirmado','concluido','cancelado'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} className={`py-2.5 px-5 text-[0.85rem] font-semibold cursor-pointer border-b-2 bg-none capitalize transition-all ${filtro===f ? 'text-[#8b9eff] border-[#5b6cff]' : 'text-[#7c819a] border-transparent'}`}>{f}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {items.map(ag => {
          const s = ST[ag.status_agendamento] || ST.pendente;
          return (
            <div key={ag.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 hover:border-[#3a3f55] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1a1e29] border border-[#2a2f42] flex items-center justify-center"><span className="material-icons-outlined" style={{fontSize:22}}>{s.i}</span></div>
                  <div>
                    <h4 className="text-[0.9rem] font-bold text-[#e8eaf2]">{ag.cliente_nome || 'Cliente'}</h4>
                    <p className="text-[0.78rem] text-[#7c819a]">{ag.servico_nome || ''} · {ag.data_agendamento} · {ag.hora_inicio?.slice(0,5)}</p>
                    {ag.notas && <p className="text-[0.75rem] text-[#8890b0] mt-1 italic">"{ag.notas}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${s.bg} ${s.t} text-[0.7rem] font-bold uppercase py-1 px-2.5 rounded-full`}>{s.l}</span>
                  {ag.status_agendamento === 'pendente' && (<>
                    <button onClick={() => aceitar(ag.id)} className="flex items-center gap-1 py-2 px-3 rounded-lg font-semibold text-[0.8rem] bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25"><span className="material-icons-outlined" style={{fontSize:15}}>check</span> Aceitar</button>
                    <button onClick={() => recusar(ag.id)} className="flex items-center gap-1 py-2 px-3 rounded-lg font-semibold text-[0.8rem] bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20"><span className="material-icons-outlined" style={{fontSize:15}}>close</span></button>
                  </>)}
                  {ag.status_agendamento === 'confirmado' && (
                    <button onClick={() => concluir(ag.id)} className="flex items-center gap-1 py-2 px-3 rounded-lg font-semibold text-[0.8rem] bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25"><span className="material-icons-outlined" style={{fontSize:15}}>task_alt</span> Concluir</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {items.length === 0 && <div className="text-center py-16 text-[#7c819a]"><span className="material-icons-outlined" style={{fontSize:48}}>event_busy</span><p className="mt-2">Nenhum agendamento.</p></div>}
      <Toast msg={toast} type="success" />
    </div>
  );
}
