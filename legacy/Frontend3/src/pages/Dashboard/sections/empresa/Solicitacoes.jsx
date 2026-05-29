import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import Button from '../../../../components/ui/Button';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
export default function Solicitacoes(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  async function load(){setLoading(true);var r=await api('GET','/api/solicitacoes/pendentes',null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token]);
  async function resp(id,st){var r=await api('PUT','/api/solicitacoes/'+id+'/responder',{status:st},token);if(r.success){setToast({visible:true,message:'Solicitacao '+st,type:'success'});load();}else setToast({visible:true,message:r.message,type:'error'});}
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/><h1 className="text-2xl font-bold text-[var(--text-primary)]">Solicitacoes</h1>{loading?<Spinner className="py-20"/>:<div className="space-y-3">{items.length===0&&<p className="text-[var(--text-muted)] text-center py-12">Nenhuma</p>}{items.map(function(s){return <div key={s.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><div className="flex items-center justify-between flex-wrap gap-4"><div><p className="text-[var(--text-primary)] font-medium">+{s.minutos_extra} min</p><p className="text-sm text-[var(--text-secondary)]">Agendamento #{s.agendamento_id}</p><p className="text-sm text-[var(--text-muted)] mt-1">Motivo: {s.motivo}</p></div><div className="flex gap-2"><Button size="sm" onClick={function(){resp(s.id,'aceito');}}>Aceitar</Button><Button size="sm" variant="danger" onClick={function(){resp(s.id,'negado');}}>Negar</Button></div></div></div>})}</div>}</div>);
}