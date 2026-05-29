import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import CalendarGrid from '../../../../components/shared/CalendarGrid';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import Select from '../../../../components/ui/Select';
import Input from '../../../../components/ui/Input';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import {FiPlus,FiTrash2} from 'react-icons/fi';
var months=['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
export default function Calendario(){
  const {token}=useContext(AuthContext);
  var now=new Date();
  const [year,setYear]=useState(now.getFullYear());const [month,setMonth]=useState(now.getMonth()+1);
  const [data,setData]=useState({});const [loading,setLoading]=useState(true);
  const [regras,setRegras]=useState([]);const [tags,setTags]=useState([]);
  const [modal,setModal]=useState(false);const [dayModal,setDayModal]=useState(null);const [dayRegras,setDayRegras]=useState([]);
  const [form,setForm]=useState({});const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  async function load(){setLoading(true);var r1=await api('GET','/api/regras/calendario?ano='+year+'&mes='+month,null,token);var r2=await api('GET','/api/regras',null,token);var r3=await api('GET','/api/tags',null,token);if(r1.success)setData(r1.data||{});if(r2.success)setRegras(r2.data||[]);if(r3.success)setTags(r3.data||[]);setLoading(false);}
  useEffect(function(){load();},[token,year,month]);
  function ch(d){var m=month+d,y=year;if(m<1){m=12;y--;}if(m>12){m=1;y++;}setMonth(m);setYear(y);}
  async function showDay(ds){setDayModal(ds);var r=await api('GET','/api/regras/dia?data='+ds,null,token);if(r.success)setDayRegras(r.data||[]);else setDayRegras([]);}
  function u(f){return function(e){setForm(function(p){var n=Object.assign({},p);n[f]=e.target.value;return n;});};}
  async function saveRegra(){var b=Object.assign({},form,{prioridade:parseInt(form.prioridade)||10});if(b.dia_semana!=='')b.dia_semana=parseInt(b.dia_semana);if(b.tag_id)b.tag_id=parseInt(b.tag_id);var r=await api('POST','/api/regras',b,token);if(r.success){setToast({visible:true,message:'Regra criada!',type:'success'});setModal(false);load();}else setToast({visible:true,message:r.message,type:'error'});}
  async function delRegra(id){if(!confirm('Remover?'))return;await api('DELETE','/api/regras/'+id,null,token);load();}
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/>
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendario</h1><Button onClick={function(){setForm({tag_id:'',tipo:'padrao',dia_semana:'',prioridade:10});setModal(true);}}><FiPlus className="mr-2"/>Nova Regra</Button></div>
    <div className="flex items-center justify-between"><button onClick={function(){ch(-1);}} className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]">←</button><h2 className="text-lg font-semibold text-[var(--text-primary)]">{months[month-1]} {year}</h2><button onClick={function(){ch(1);}} className="px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]">→</button></div>
    {loading?<Spinner className="py-12"/>:<div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><CalendarGrid year={year} month={month} data={data} onDayClick={showDay}/></div>}
    {regras.length>0&&<div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Regras</h3><div className="space-y-2">{regras.map(function(r){var tag=tags.find(function(t){return t.id===r.tag_id;});return <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]"><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:tag?tag.cor:'#888'}}/><div><p className="text-sm font-medium text-[var(--text-primary)]">{tag?tag.label:'Tag #'+r.tag_id} <span className="text-[var(--text-muted)]">({r.tipo})</span></p>{r.dia_semana!==null&&r.dia_semana!==undefined&&<p className="text-xs text-[var(--text-muted)]">Dia: {['Dom','Seg','Ter','Qua','Qui','Sex','Sab'][r.dia_semana]}</p>}</div></div><div className="flex items-center gap-2"><span className="text-xs text-[var(--text-muted)]">P:{r.prioridade}</span><button onClick={function(){delRegra(r.id);}} className="p-1 rounded hover:bg-red-500/10"><FiTrash2 size={14} className="text-[var(--text-muted)]"/></button></div></div>})}</div></div>}
    <Modal open={!!dayModal} onClose={function(){setDayModal(null);}} title={'Regras: '+(dayModal||'')}><div className="space-y-3">{dayRegras.length===0&&<p className="text-[var(--text-muted)]">Nenhuma</p>}{dayRegras.map(function(r){var tag=tags.find(function(t){return t.id===r.tag_id;});return <div key={r.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:tag?tag.cor:'#888'}}/><div><p className="text-sm font-medium text-[var(--text-primary)]">{tag?tag.label:'Tag #'+r.tag_id}</p><p className="text-xs text-[var(--text-muted)]">{r.tipo} - P:{r.prioridade}</p></div></div>})}</div></Modal>
    <Modal open={modal} onClose={function(){setModal(false);}} title="Nova Regra"><div className="space-y-4"><Select label="Tag" value={form.tag_id||''} onChange={u('tag_id')} options={[{value:'',label:'Selecione...'}].concat(tags.map(function(t){return{value:t.id,label:t.label||t.nome};}))}/><Select label="Tipo" value={form.tipo||'padrao'} onChange={u('tipo')} options={[{value:'padrao',label:'Padrao (repete)'},{value:'excecao',label:'Excecao (sobrepoe)'},{value:'unico',label:'Unico'}]}/><Select label="Dia Semana" value={form.dia_semana||''} onChange={u('dia_semana')} options={[{value:'',label:'Todos'},{value:'0',label:'Domingo'},{value:'1',label:'Segunda'},{value:'2',label:'Terca'},{value:'3',label:'Quarta'},{value:'4',label:'Quinta'},{value:'5',label:'Sexta'},{value:'6',label:'Sabado'}]}/><Input label="Prioridade (0-255)" type="number" value={form.prioridade||10} onChange={u('prioridade')}/><Button onClick={saveRegra} className="w-full">Criar</Button></div></Modal>
  </div>);
}