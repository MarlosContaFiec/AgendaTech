import React,{useState,useEffect,useContext,useRef} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api,uploadFile} from '../../../../services/api';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Badge from '../../../../components/ui/Badge';
import Spinner from '../../../../components/ui/Spinner';
import Toast from '../../../../components/ui/Toast';
import {FiUpload,FiTrash2,FiFile} from 'react-icons/fi';
var sb={pendente:'warning',aprovado:'success',rejeitado:'error'};
var tipos=[{value:'rg',label:'RG'},{value:'certidao_nascimento',label:'Certidao'},{value:'laudo_medico',label:'Laudo'},{value:'comprovante_residencia',label:'Comprovante'},{value:'outro',label:'Outro'}];
export default function Documentos(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [tipo,setTipo]=useState('rg');const [uploading,setUploading]=useState(false);
  const [toast,setToast]=useState({visible:false,message:'',type:'success'});const ref=useRef();
  async function load(){setLoading(true);var r=await api('GET','/api/documentos',null,token);if(r.success)setItems(r.data);setLoading(false);}
  useEffect(function(){load();},[token]);
  async function handleUpload(e){var file=e.target.files[0];if(!file)return;setUploading(true);var ur=await uploadFile(file,token);if(ur.success){var r=await api('POST','/api/documentos',{tipo:tipo,arquivo_url:ur.data.url},token);if(r.success){setToast({visible:true,message:'Enviado!',type:'success'});load();}else setToast({visible:true,message:r.message,type:'error'});}setUploading(false);ref.current.value='';}
  async function del(id){if(!confirm('?'))return;await api('DELETE','/api/documentos/'+id,null,token);load();}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><Toast {...toast} onClose={function(){setToast(Object.assign({},toast,{visible:false}));}}/><h1 className="text-2xl font-bold text-[var(--text-primary)]">Documentos</h1>
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5"><h3 className="font-semibold text-[var(--text-primary)] mb-3">Enviar</h3><div className="flex flex-wrap gap-3 items-end"><div className="flex-1 min-w-[160px]"><Select label="Tipo" value={tipo} onChange={function(e){setTipo(e.target.value);}} options={tipos}/></div><div><input ref={ref} type="file" accept="image/*,application/pdf" onChange={handleUpload} className="hidden"/><Button onClick={function(){ref.current.click();}} loading={uploading}><FiUpload className="mr-2"/>Enviar</Button></div></div></div>
    <div className="space-y-3">{items.length===0&&<div className="text-center py-12"><FiFile size={40} className="mx-auto text-[var(--text-muted)] mb-3"/><p className="text-[var(--text-muted)]">Nenhum</p></div>}{items.map(function(d){return <div key={d.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center"><FiFile size={18} className="text-[var(--text-muted)]"/></div><div><p className="font-medium text-[var(--text-primary)]">{tipos.find(function(t){return t.value===d.tipo;})?tipos.find(function(t){return t.value===d.tipo;}).label:d.tipo}</p>{d.observacao&&<p className="text-xs text-[var(--error)]">{d.observacao}</p>}</div></div><div className="flex items-center gap-2"><Badge variant={sb[d.status]}>{d.status}</Badge><button onClick={function(){del(d.id);}} className="p-1.5 rounded-lg hover:bg-red-500/10"><FiTrash2 size={16} className="text-[var(--text-muted)]"/></button></div></div>})}</div>
  </div>);
}