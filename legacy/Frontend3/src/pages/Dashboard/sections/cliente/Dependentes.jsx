import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Modal from '../../../../components/ui/Modal';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import {FiPlus,FiEdit2,FiTrash2,FiUsers} from 'react-icons/fi';
export default function Dependentes(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({nome:'',idade:''});
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});
  async function load(){setLoading(true);var r=await api('GET','/api/cliente/dependentes',null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token]);
  function openNew(){setEditing(null);setForm({nome:'',idade:''});setModal(true);}
  function openEdit(d){setEditing(d);setForm({nome:d.nome,idade:d.idade});setModal(true);}
  async function save(){var b={nome:form.nome,idade:parseInt(form.idade)};var r=editing?await api('PUT','/api/cliente/dependentes/'+editing.id,b,token):await api('POST','/api/cliente/dependentes',b,token);if(r.success){setToast({visible:true,message:'Salvo!',type:'success'});setModal(false);load();}else setToast({visible:true,message:r.message,type:'error'});}
  async function del(id){if(!confirm('?'))return;await api('DELETE','/api/cliente/dependentes/'+id,null,token);load();}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/>
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Dependentes</h1><Button onClick={openNew}><FiPlus className="mr-2"/>Adicionar</Button></div>
    {items.length===0&&<div className="text-center py-12"><FiUsers size={40} className="mx-auto text-[var(--text-muted)] mb-3"/><p className="text-[var(--text-muted)]">Nenhum</p></div>}
    <div className="space-y-3">{items.map(function(d){return <div key={d.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between"><div><p className="font-medium text-[var(--text-primary)]">{d.nome}</p><p className="text-sm text-[var(--text-muted)]">{d.idade} anos</p></div><div className="flex gap-1"><button onClick={function(){openEdit(d);}} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)]"><FiEdit2 size={16} className="text-[var(--text-muted)]"/></button><button onClick={function(){del(d.id);}} className="p-1.5 rounded-lg hover:bg-red-500/10"><FiTrash2 size={16} className="text-[var(--text-muted)]"/></button></div></div>})}</div>
    <Modal open={modal} onClose={function(){setModal(false);}} title={editing?'Editar':'Novo'}><div className="space-y-4"><Input label="Nome" value={form.nome} onChange={function(e){setForm({nome:e.target.value,idade:form.idade});}} required/><Input label="Idade" type="number" value={form.idade} onChange={function(e){setForm({nome:form.nome,idade:e.target.value});}} required/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={function(){setModal(false);}}>Cancelar</Button><Button onClick={save}>Salvar</Button></div></div></Modal>
  </div>);
}