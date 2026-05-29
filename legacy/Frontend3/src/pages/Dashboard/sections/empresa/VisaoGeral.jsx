import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatCurrency} from '../../../../utils/formatters';
import Spinner from '../../../../components/ui/Spinner';
import Badge from '../../../../components/ui/Badge';
import {FiUsers,FiCalendar,FiDollarSign,FiStar,FiCheckCircle,FiXCircle} from 'react-icons/fi';
export default function VisaoGeral(){
  const {token}=useContext(AuthContext);const [data,setData]=useState(null);const [loading,setLoading]=useState(true);
  useEffect(function(){api('GET','/api/empresa/dashboard',null,token).then(function(r){if(r.success)setData(r.data);setLoading(false);});},[token]);
  if(loading)return <Spinner className="py-20"/>;
  if(!data)return <p className="text-[var(--text-muted)]">Erro ao carregar</p>;
  var stats=[{label:'Clientes',value:data.total_clientes,icon:FiUsers,color:'text-cyan-400',bg:'bg-cyan-400/10'},{label:'Agendamentos',value:data.total_agendamentos,icon:FiCalendar,color:'text-violet-400',bg:'bg-violet-400/10'},{label:'Concluidos',value:data.concluidos,icon:FiCheckCircle,color:'text-emerald-400',bg:'bg-emerald-400/10'},{label:'Cancelados',value:data.cancelados,icon:FiXCircle,color:'text-red-400',bg:'bg-red-400/10'},{label:'Receita',value:formatCurrency(data.receita_total),icon:FiDollarSign,color:'text-amber-400',bg:'bg-amber-400/10'},{label:'Avaliacao',value:data.media_avaliacao?Number(data.media_avaliacao).toFixed(1):'-',icon:FiStar,color:'text-amber-400',bg:'bg-amber-400/10'}];
  return(<div className="space-y-6"><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Visao Geral</h1><p className="text-[var(--text-muted)]">Resumo da empresa</p></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{stats.map(function(s,i){return <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-center justify-between mb-3"><span className="text-sm text-[var(--text-muted)]">{s.label}</span><div className={'w-10 h-10 rounded-xl flex items-center justify-center '+s.bg}><s.icon size={20} className={s.color}/></div></div><p className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</p></div>})}</div>
    {data.ultimos&&data.ultimos.length>0&&<div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ultimos</h3><div className="space-y-2">{data.ultimos.map(function(a){return <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]"><div><p className="text-[var(--text-primary)] font-medium">{a.cliente_nome}</p><p className="text-xs text-[var(--text-muted)]">{a.servico_nome}</p></div><Badge variant={a.status_agendamento==='confirmado'?'success':a.status_agendamento==='pendente'?'warning':'default'}>{a.status_agendamento}</Badge></div>})}</div></div>}
  </div>);
}