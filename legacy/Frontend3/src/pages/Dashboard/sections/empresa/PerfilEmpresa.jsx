import React,{useState,useEffect,useContext,useRef} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api,uploadFile,getFileUrl} from '../../../../services/api';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Textarea from '../../../../components/ui/Textarea';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
export default function PerfilEmpresa(){
  const {token}=useContext(AuthContext);
  const [form,setForm]=useState({});const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});const ref=useRef();
  useEffect(function(){api('GET','/api/empresa/perfil',null,token).then(function(r){if(r.success)setForm(r.data);setLoading(false);});},[token]);
  function u(f){return function(e){setForm(function(p){var n=Object.assign({},p);n[f]=e.target.value;return n;});};}
  async function handleLogo(e){var file=e.target.files[0];if(!file)return;var r=await uploadFile(file,token);if(r.success){setForm(function(p){var n=Object.assign({},p);n.logo_url=r.data.url;return n;});setToast({visible:true,message:'Logo atualizada!',type:'success'});}}
  async function save(){setSaving(true);var r=await api('PUT','/api/empresa/perfil',form,token);setSaving(false);if(r.success)setToast({visible:true,message:'Salvo!',type:'success'});else setToast({visible:true,message:r.message,type:'error'});}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6 max-w-2xl"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/><h1 className="text-2xl font-bold text-[var(--text-primary)]">Perfil</h1>
    <div className="flex items-center gap-4"><div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] overflow-hidden flex items-center justify-center">{form.logo_url?<img src={getFileUrl(form.logo_url)} alt="" className="w-full h-full object-cover"/>:<span className="text-2xl text-[var(--text-muted)]">{(form.nome_fantasia||'E')[0]}</span>}</div><div><input ref={ref} type="file" accept="image/*" onChange={handleLogo} className="hidden"/><Button size="sm" variant="secondary" onClick={function(){ref.current.click();}}>Alterar logo</Button></div></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input label="Nome Fantasia" value={form.nome_fantasia||''} onChange={u('nome_fantasia')}/><Input label="Telefone" value={form.telefone||''} onChange={u('telefone')}/><Input label="Cidade" value={form.cidade||''} onChange={u('cidade')}/><Input label="Estado" value={form.estado||''} onChange={u('estado')} maxLength={2}/><Input label="Nicho" value={form.nicho||''} onChange={u('nicho')}/><Input label="Sub-nicho" value={form.sub_nicho||''} onChange={u('sub_nicho')}/></div>
    <Textarea label="Descricao" value={form.descricao||''} onChange={u('descricao')} rows={4}/>
    <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Cor Primaria</label><div className="flex items-center gap-3"><input type="color" value={form.cor_primaria||'#06b6d4'} onChange={u('cor_primaria')} className="w-10 h-10 rounded-lg cursor-pointer"/><span className="text-sm text-[var(--text-muted)]">{form.cor_primaria||'#06b6d4'}</span></div></div><div><label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Cor Secundaria</label><div className="flex items-center gap-3"><input type="color" value={form.cor_secundaria||'#8b5cf6'} onChange={u('cor_secundaria')} className="w-10 h-10 rounded-lg cursor-pointer"/><span className="text-sm text-[var(--text-muted)]">{form.cor_secundaria||'#8b5cf6'}</span></div></div></div>
    <Button onClick={save} loading={saving}>Salvar</Button></div>);
}