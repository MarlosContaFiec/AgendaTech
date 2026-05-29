import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDate,formatTime} from '../../../../utils/formatters';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import {FiClock,FiX,FiCheck} from 'react-icons/fi';
var sb={aguardando:'info',notificado:'warning',convertido:'success',cancelado:'error'};
export default function FilaEspera(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  async function load(){setLoading(true);var r=await api('GET','/api/fila',null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token]);
  async function cancelar(id){var r=await api('DELETE','/api/fila/'+id,null,token);if(r.success){setToast({visible:true,message:'Saiu da fila',type:'success'});load();}}
  async function converter(id){var r=await api('PUT','/api/fila/'+id+'/converter',null,token);if(r.success){setToast({visible:true,message:'Vaga confirmada!',type:'success'});load();}else setToast({visible:true,message:r.message,type:'error'});}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/><h1 className="text-2xl font-bold text-[var(--text-primary)]">Fila de Espera</h1>
    {items.length===0&&<div className="text-center py-12"><FiClock size={40} className="mx-auto text-[var(--text-muted)] mb-3"/><p className="text-[var(--text-muted)]">Nenhuma fila</p></div>}
    <div className="space-y-3">{items.map(function(f){return <div key={f.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4"><div className="flex items-center justify-between flex-wrap gap-3"><div><div className="flex items-center gap-2"><p className="font-medium text-[var(--text-primary)]">{f.servico_nome||'Servico #'+f.servico_id}</p><Badge variant={sb[f.status]}>{f.status}</Badge></div><p className="text-sm text-[var(--text-muted)]">{formatDate(f.data_agendamento)} {formatTime(f.hora_inicio)}</p></div><div className="flex gap-2">{f.status==='notificado'&&<Button size="sm" onClick={function(){converter(f.id);}}><FiCheck className="mr-1"/>Confirmar</Button>}{(f.status==='aguardando'||f.status==='notificado')&&<Button size="sm" variant="danger" onClick={function(){cancelar(f.id);}}><FiX className="mr-1"/>Sair</Button>}</div></div></div>})}</div>
  </div>);
}
