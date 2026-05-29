import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDate,formatTime,formatCurrency} from '../../../../utils/formatters';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import Select from '../../../../components/ui/Select';
import Modal from '../../../../components/ui/Modal';
import Input from '../../../../components/ui/Input';
import {FiCheck,FiX,FiCheckCircle} from 'react-icons/fi';
var sb={pendente:'warning',confirmado:'info',cancelado:'error',concluido:'success'};
export default function AgendamentosEmpresa(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [filter,setFilter]=useState('');
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  const [recId,setRecId]=useState(null);const [motivo,setMotivo]=useState('');
  async function load(){setLoading(true);var r=await api('GET','/api/agendamentos/empresa'+(filter?'?status='+filter:''),null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token,filter]);
  async function act(id,action,body){var r=await api('PUT','/api/agendamentos/'+id+'/'+action,body||null,token);if(r.success){setToast({visible:true,message:action+'!',type:'success'});load();}else setToast({visible:true,message:r.message,type:'error'});}
  async function confirmRec(){await act(recId,'recusar',{motivo:motivo});setRecId(null);setMotivo('');}
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/>
    <div className="flex items-center justify-between flex-wrap gap-4"><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Agendamentos</h1><p className="text-[var(--text-muted)]">{items.length} itens</p></div><Select value={filter} onChange={function(e){setFilter(e.target.value);}} options={[{value:'',label:'Todos'},{value:'pendente',label:'Pendentes'},{value:'confirmado',label:'Confirmados'},{value:'concluido',label:'Concluidos'},{value:'cancelado',label:'Cancelados'}]}/></div>
    {loading?<Spinner className="py-20"/>:<div className="space-y-3">{items.length===0&&<p className="text-[var(--text-muted)] text-center py-12">Nenhum</p>}{items.map(function(a){return <div key={a.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-center justify-between flex-wrap gap-4"><div className="space-y-1"><div className="flex items-center gap-3"><h3 className="font-semibold text-[var(--text-primary)]">{a.cliente_nome||'Cliente'}</h3><Badge variant={sb[a.status_agendamento]}>{a.status_agendamento}</Badge></div><p className="text-sm text-[var(--text-secondary)]">{a.servico_nome} - {formatCurrency(a.valor)}</p><p className="text-sm text-[var(--text-muted)]">{formatDate(a.data_agendamento)} {formatTime(a.hora_inicio)} - {formatTime(a.hora_fim)}</p></div>{a.status_agendamento==='pendente'&&<div className="flex gap-2"><Button size="sm" onClick={function(){act(a.id,'aceitar');}}><FiCheck className="mr-1"/>Aceitar</Button><Button size="sm" variant="danger" onClick={function(){setRecId(a.id);}}><FiX className="mr-1"/>Recusar</Button></div>}{a.status_agendamento==='confirmado'&&<Button size="sm" variant="secondary" onClick={function(){act(a.id,'concluir');}}><FiCheckCircle className="mr-1"/>Concluir</Button>}</div></div>})}</div>}
    <Modal open={!!recId} onClose={function(){setRecId(null);}} title="Recusar"><div className="space-y-4"><Input label="Motivo" value={motivo} onChange={function(e){setMotivo(e.target.value);}} placeholder="Obrigatorio"/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={function(){setRecId(null);}}>Cancelar</Button><Button variant="danger" onClick={confirmRec}>Recusar</Button></div></div></Modal>
  </div>);
}