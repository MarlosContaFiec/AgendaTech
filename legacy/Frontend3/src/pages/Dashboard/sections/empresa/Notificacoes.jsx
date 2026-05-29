import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDateTime} from '../../../../utils/formatters';
import Spinner from '../../../../components/ui/Spinner';
import {FiBell} from 'react-icons/fi';
export default function Notificacoes(){
  const {token}=useContext(AuthContext);
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(function(){api('GET','/api/notificacoes',null,token).then(function(r){if(r.success)setItems(r.data);setLoading(false);});},[token]);
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Notificacoes</h1><div className="space-y-2">{items.length===0&&<div className="text-center py-12"><FiBell size={40} className="mx-auto text-[var(--text-muted)] mb-3"/><p className="text-[var(--text-muted)]">Nenhuma</p></div>}{items.map(function(n){return <div key={n.id} className={'bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 '+(n.lida===false?'border-l-2 border-l-[var(--accent)]':'')}><p className="text-sm text-[var(--text-primary)]">{n.mensagem}</p><p className="text-xs text-[var(--text-muted)] mt-1">{formatDateTime(n.enviado_em)}</p></div>})}</div></div>);
}