import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDate,formatTime,formatCurrency} from '../../../../utils/formatters';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import Modal from '../../../../components/ui/Modal';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import ModalAvaliacao from '../../../../components/shared/ModalAvaliacao';
import {FiX,FiRefreshCw,FiStar,FiClock} from 'react-icons/fi';
var sb={pendente:'warning',confirmado:'info',cancelado:'error',concluido:'success'};
export default function MeusAgendamentos(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [filter,setFilter]=useState('');
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  const [cancelId,setCancelId]=useState(null);const [motivo,setMotivo]=useState('');
  const [reschId,setReschId]=useState(null);const [nDate,setNDate]=useState('');const [nTime,setNTime]=useState('');
  const [avalId,setAvalId]=useState(null);
  const [solId,setSolId]=useState(null);const [solMin,setSolMin]=useState('30');const [solMot,setSolMot]=useState('');
  async function load(){setLoading(true);var r=await api('GET','/api/agendamentos/cliente'+(filter?'?status='+filter:''),null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token,filter]);
  async function cancel(){var r=await api('PUT','/api/agendamentos/'+cancelId+'/cancelar',{motivo:motivo},token);if(r.success){setToast({visible:true,message:'Cancelado',type:'success'});setCancelId(null);setMotivo('');load();}else setToast({visible:true,message:r.message,type:'error'});}
  async function reschedule(){var r=await api('PUT','/api/agendamentos/'+reschId+'/reagendar',{data_agendamento:nDate,hora_inicio:nTime},token);if(r.success){setToast({visible:true,message:'Reagendado!',type:'success'});setReschId(null);load();}else setToast({visible:true,message:r.message,type:'error'});}
  async function solicitar(){var r=await api('POST','/api/solicitacoes',{agendamento_id:solId,minutos_extra:parseInt(solMin),motivo:solMot},token);if(r.success){setToast({visible:true,message:'Solicitacao enviada!',type:'success'});setSolId(null);setSolMot('');}else setToast({visible:true,message:r.message,type:'error'});}
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/>
    <div className="flex items-center justify-between flex-wrap gap-4"><div><h1 className="text-2xl font-bold text-[var(--text-primary)]">Agendamentos</h1><p className="text-[var(--text-muted)]">{items.length}</p></div><Select value={filter} onChange={function(e){setFilter(e.target.value);}} options={[{value:'',label:'Todos'},{value:'pendente',label:'Pendentes'},{value:'confirmado',label:'Confirmados'},{value:'concluido',label:'Concluidos'},{value:'cancelado',label:'Cancelados'}]}/></div>
    {loading?<Spinner className="py-20"/>:<div className="space-y-3">{items.length===0&&<p className="text-[var(--text-muted)] text-center py-12">Nenhum</p>}{items.map(function(a){return <div key={a.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-start justify-between flex-wrap gap-4"><div className="space-y-1"><div className="flex items-center gap-3"><h3 className="font-semibold text-[var(--text-primary)]">{a.servico_nome||a.empresa_nome||'Servico'}</h3><Badge variant={sb[a.status_agendamento]}>{a.status_agendamento}</Badge></div><p className="text-sm text-[var(--text-secondary)]">{a.empresa_nome}</p><p className="text-sm text-[var(--text-muted)]">{formatDate(a.data_agendamento)} {formatTime(a.hora_inicio)} - {formatTime(a.hora_fim)}</p>{a.valor&&<p className="text-sm text-[var(--accent)]">{formatCurrency(a.valor)}</p>}</div><div className="flex gap-2 flex-wrap">{a.status_agendamento==='confirmado'&&<Button size="sm" variant="secondary" onClick={function(){setSolId(a.id);setSolMin('30');setSolMot('');}}><FiClock className="mr-1"/>Extra</Button>}{a.status_agendamento==='concluido'&&<Button size="sm" variant="secondary" onClick={function(){setAvalId(a.id);}}><FiStar className="mr-1"/>Avaliar</Button>}{(a.status_agendamento==='pendente'||a.status_agendamento==='confirmado')&&<><Button size="sm" variant="secondary" onClick={function(){setReschId(a.id);}}><FiRefreshCw className="mr-1"/></Button><Button size="sm" variant="danger" onClick={function(){setCancelId(a.id);}}><FiX className="mr-1"/></Button></>}</div></div></div>})}</div>}
    <Modal open={!!cancelId} onClose={function(){setCancelId(null);}} title="Cancelar"><div className="space-y-4"><Input label="Motivo" value={motivo} onChange={function(e){setMotivo(e.target.value);}}/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={function(){setCancelId(null);}}>Voltar</Button><Button variant="danger" onClick={cancel}>Cancelar</Button></div></div></Modal>
    <Modal open={!!reschId} onClose={function(){setReschId(null);}} title="Reagendar"><div className="space-y-4"><Input label="Data" type="date" value={nDate} onChange={function(e){setNDate(e.target.value);}}/><Input label="Hora" type="time" value={nTime} onChange={function(e){setNTime(e.target.value);}}/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={function(){setReschId(null);}}>Voltar</Button><Button onClick={reschedule}>Reagendar</Button></div></div></Modal>
    <Modal open={!!solId} onClose={function(){setSolId(null);}} title="Tempo Extra"><div className="space-y-4"><Select label="Minutos" value={solMin} onChange={function(e){setSolMin(e.target.value);}} options={[{value:'15',label:'+15min'},{value:'30',label:'+30min'},{value:'45',label:'+45min'},{value:'60',label:'+60min'},{value:'90',label:'+90min'},{value:'120',label:'+120min'}]}/><Textarea label="Motivo" value={solMot} onChange={function(e){setSolMot(e.target.value);}} rows={3}/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={function(){setSolId(null);}}>Cancelar</Button><Button onClick={solicitar}>Enviar</Button></div></div></Modal>
    <ModalAvaliacao open={!!avalId} onClose={function(){setAvalId(null);}} agendamentoId={avalId} token={token} onSaved={load}/>
  </div>);
}