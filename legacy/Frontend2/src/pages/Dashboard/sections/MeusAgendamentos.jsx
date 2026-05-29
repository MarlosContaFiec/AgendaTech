import { useState, useEffect } from 'react';
import { apiAgendamentosCliente, apiCancelarAgendamento } from '@/services/agendamentos';
import { formatDate } from '@/utils/formatters';
import CalendarGrid from '@/components/shared/CalendarGrid';
import { Toast } from '@/components/ui/Toast';

const ST = {
  confirmado: { bg:'bg-green-500/15', t:'text-green-400', l:'Confirmado', i:'check_circle' },
  pendente:   { bg:'bg-amber-500/15', t:'text-amber-400', l:'Pendente',   i:'schedule' },
  concluido:  { bg:'bg-blue-500/15',  t:'text-blue-300',  l:'Concluído',  i:'task_alt' },
  cancelado:  { bg:'bg-red-500/15',   t:'text-red-400',   l:'Cancelado',  i:'cancel' },
};

export default function MeusAgendamentos() {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [toast, setToast] = useState('');

  async function carregar() {
    setLoad(true);
    const res = await apiAgendamentosCliente(filtro || null);
    if (res.success) setItems(res.data || []);
    setLoad(false);
  }
  useEffect(() => { carregar(); }, [filtro]);

  async function cancelar(ag) {
    if (!confirm(`Cancelar ${ag.servico_nome}?`)) return;
    const res = await apiCancelarAgendamento(ag.id, 'Cancelado pelo cliente');
    if (res.success) {
      if (res.taxaInfo) alert(`${res.taxaInfo.mensagem} - Taxa: R$ ${res.taxaInfo.taxa.toFixed(2)}`);
      setToast('Cancelado.'); carregar();
    }
    setTimeout(() => setToast(''), 3000);
  }

  const evCal = items.filter(a => a.status_agendamento !== 'cancelado').map(a => ({ data: a.data_agendamento }));

  return (
    <div className="animate-fadeUp">
      <div className="mb-6"><h1 className="text-[1.5rem] font-extrabold text-[#e8eaf2] mb-1">Meus Agendamentos</h1><p className="text-[0.85rem] text-[#7c819a]">Gerencie seus horários</p></div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-0 mb-6 border-b border-[#2a2f42]">
            {[{id:'',l:'Todos'},{id:'confirmado',l:'Confirmados'},{id:'pendente',l:'Pendentes'},{id:'concluido',l:'Histórico'}].map(a => (
              <button key={a.id} onClick={() => setFiltro(a.id)} className={`py-2.5 px-5 text-[0.85rem] font-semibold cursor-pointer border-b-2 bg-none transition-all ${filtro===a.id ? 'text-[#8b9eff] border-[#5b6cff]' : 'text-[#7c819a] border-transparent'}`}>{a.l}</button>
            ))}
          </div>
          {load ? <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-tb-accent/20 border-t-tb-accent rounded-full animate-spin" /></div>
          : items.length === 0 ? <div className="text-center py-16 text-[#7c819a]"><span className="material-icons-outlined" style={{fontSize:48}}>event_available</span><p className="mt-2">Nenhum agendamento.</p></div>
          : <div className="flex flex-col gap-3">{items.map(ag => { const s = ST[ag.status_agendamento] || ST.pendente; return (
            <div key={ag.id} className="bg-[#13161e] border border-[#2a2f42] rounded-xl p-5 flex items-center justify-between hover:border-[#3a3f55] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1a1e29] border border-[#2a2f42] flex items-center justify-center"><span className="material-icons-outlined" style={{fontSize:22}}>{s.i}</span></div>
                <div><h4 className="text-[0.9rem] font-bold text-[#e8eaf2]">{ag.servico_nome || 'Serviço'}</h4><p className="text-[0.78rem] text-[#7c819a]">{ag.empresa_nome || ''} · {formatDate(ag.data_agendamento)} · {ag.hora_inicio?.slice(0,5)}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${s.bg} ${s.t} text-[0.7rem] font-bold uppercase py-1 px-2.5 rounded-full`}>{s.l}</span>
                {(ag.status_agendamento==='confirmado'||ag.status_agendamento==='pendente') && (
                  <button onClick={() => cancelar(ag)} className="flex items-center gap-1 py-2 px-3 rounded-lg font-semibold text-[0.8rem] bg-red-500/10 text-red-400 border border-red-500/25 hover:bg-red-500/20"><span className="material-icons-outlined" style={{fontSize:15}}>cancel</span></button>
                )}
              </div>
            </div>);})}</div>}
        </div>
        <div className="hidden lg:block w-[280px] flex-shrink-0"><CalendarGrid eventos={evCal} /></div>
      </div>
      <Toast msg={toast} type="success" />
    </div>
  );
}
