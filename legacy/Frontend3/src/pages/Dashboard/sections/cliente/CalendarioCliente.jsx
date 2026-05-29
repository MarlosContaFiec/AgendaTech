import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDate,formatTime} from '../../../../utils/formatters';
import CalendarGrid from '../../../../components/shared/CalendarGrid';
import Badge from '../../../../components/ui/Badge';
import Spinner from '../../../../components/ui/Spinner';
var months=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
export default function CalendarioCliente(){
  const {token}=useContext(AuthContext);var now=new Date();
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [selDate,setSelDate]=useState(null);
  const [year,setYear]=useState(now.getFullYear());const [month,setMonth]=useState(now.getMonth()+1);
  useEffect(function(){api('GET','/api/cliente/calendario',null,token).then(function(r){if(r.success)setItems(r.data);setLoading(false);});},[token]);
  function ch(d){var m=month+d,y=year;if(m<1){m=12;y--;}if(m>12){m=1;y++;}setMonth(m);setYear(y);}
  var calData={};items.forEach(function(a){calData[a.data_agendamento]={aberto:true,tags:[]};});
  var selItems=selDate?items.filter(function(a){return a.data_agendamento===selDate;}):[];
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendario</h1>
    <div className="flex items-center justify-between"><button onClick={function(){ch(-1);}} className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]">←</button><h2 className="text-lg font-semibold text-[var(--text-primary)]">{months[month-1]} {year}</h2><button onClick={function(){ch(1);}} className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]">→</button></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><CalendarGrid year={year} month={month} data={calData} onDayClick={setSelDate} selectedDate={selDate}/></div><div className="space-y-3"><h2 className="text-lg font-semibold text-[var(--text-primary)]">{selDate?formatDate(selDate):'Selecione um dia'}</h2>{selItems.length===0&&selDate&&<p className="text-[var(--text-muted)]">Nenhum agendamento</p>}{selItems.map(function(a){return <div key={a.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4"><div className="flex items-center justify-between"><div><p className="font-medium text-[var(--text-primary)]">{a.servico_nome}</p><p className="text-sm text-[var(--text-muted)]">{a.empresa_nome}</p><p className="text-xs text-[var(--text-muted)]">{formatTime(a.hora_inicio)} - {formatTime(a.hora_fim)}</p></div><Badge variant={a.status_agendamento==='confirmado'?'success':a.status_agendamento==='pendente'?'warning':'default'}>{a.status_agendamento}</Badge></div></div>})}</div></div>
  </div>);
}