import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import ScoreRing from '../../../../components/ui/ScoreRing';
import {phone} from '../../../../utils/masks';
export default function PerfilCliente(){
  const {token}=useContext(AuthContext);
  const [form,setForm]=useState({});const [score,setScore]=useState(null);
  const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  useEffect(function(){Promise.all([api('GET','/api/cliente/perfil',null,token),api('GET','/api/cliente/score',null,token)]).then(function(r){if(r[0].success)setForm(r[0].data);if(r[1].success)setScore(r[1].data);setLoading(false);});},[token]);
  function u(f){return function(e){setForm(function(p){var n=Object.assign({},p);n[f]=e.target.value;return n;});};}
  async function save(){setSaving(true);var r=await api('PUT','/api/cliente/perfil',form,token);setSaving(false);if(r.success)setToast({visible:true,message:'Salvo!',type:'success'});else setToast({visible:true,message:r.message,type:'error'});}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6 max-w-2xl"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/><h1 className="text-2xl font-bold text-[var(--text-primary)]">Meu Perfil</h1>
    {form.score!==undefined&&<div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4"><ScoreRing score={parseFloat(form.score)} size={72}/><div><p className="font-semibold text-[var(--text-primary)]">Score</p><p className="text-sm text-[var(--text-muted)]">Compareca para manter alto</p></div></div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Nome" value={form.nome||''} onChange={u('nome')}/><Input label="Telefone" value={form.telefone||''} onChange={function(e){setForm(function(p){var n=Object.assign({},p);n.telefone=phone(e.target.value);return n;});}}/><Input label="Nascimento" type="date" value={form.data_nascimento||''} onChange={u('data_nascimento')}/><Input label="CPF" value={form.cpf||''} disabled/></div>
    <Button onClick={save} loading={saving}>Salvar</Button>
    {score&&score.length>0&&<div><h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Historico</h3><div className="space-y-2">{score.map(function(s,i){return <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-between"><div><p className="text-sm text-[var(--text-primary)]">{s.motivo}</p><p className="text-xs text-[var(--text-muted)]">{s.servico_nome} - {s.data_agendamento}</p></div><span className={'font-bold '+(s.variacao>0?'text-emerald-400':'text-red-400')}>{s.variacao>0?'+':''}{Number(s.variacao).toFixed(1)}</span></div>})}</div></div>}
  </div>);
}