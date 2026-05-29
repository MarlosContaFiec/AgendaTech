import React,{useState,useEffect,useContext,useRef} from 'react';
import {AuthContext} from '../../../../contexts/AuthContext';
import {api} from '../../../../services/api';
import {formatDateTime} from '../../../../utils/formatters';
import Spinner from '../../../../components/ui/Spinner';
import {FiSend,FiMessageCircle} from 'react-icons/fi';
export default function Mensagens(){
  const {token}=useContext(AuthContext);
  const [convs,setConvs]=useState([]);const [loading,setLoading]=useState(true);
  const [sel,setSel]=useState(null);const [msgs,setMsgs]=useState([]);const [msgLoad,setMsgLoad]=useState(false);
  const [newMsg,setNewMsg]=useState('');const [sending,setSending]=useState(false);const bRef=useRef();
  useEffect(function(){api('GET','/api/mensagens/conversas',null,token).then(function(r){if(r.success)setConvs(r.data||[]);setLoading(false);});},[token]);
  async function selectChat(c){setSel(c);setMsgLoad(true);var r=await api('GET','/api/mensagens/conversas/'+c.cliente_id,null,token);if(r.success)setMsgs(r.data||[]);setMsgLoad(false);setTimeout(function(){if(bRef.current)bRef.current.scrollIntoView({behavior:'smooth'});},100);}
  async function send(){if(!newMsg.trim()||!sel)return;setSending(true);var r=await api('POST','/api/mensagens/conversas/'+sel.cliente_id,{mensagem:newMsg},token);if(r.success){setNewMsg('');var hr=await api('GET','/api/mensagens/conversas/'+sel.cliente_id,null,token);if(hr.success)setMsgs(hr.data||[]);}setSending(false);setTimeout(function(){if(bRef.current)bRef.current.scrollIntoView({behavior:'smooth'});},100);}
  if(loading)return <Spinner className="py-20"/>;
  return(<div className="space-y-6"><h1 className="text-2xl font-bold text-[var(--text-primary)]">Mensagens</h1>
    <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[400px]">
      <div className="w-72 flex-shrink-0 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col"><div className="p-3 border-b border-[var(--border)]"><p className="text-sm font-medium text-[var(--text-secondary)]">Conversas</p></div><div className="flex-1 overflow-y-auto">{convs.length===0&&<p className="text-sm text-[var(--text-muted)] text-center py-8">Nenhuma</p>}{convs.map(function(c){return <button key={c.cliente_id} onClick={function(){selectChat(c);}} className={'w-full text-left p-3 border-b border-[var(--border)] transition-colors '+(sel&&sel.cliente_id===c.cliente_id?'bg-[var(--accent-muted)]':'hover:bg-[var(--bg-surface-hover)]')}><p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.cliente_nome||'Cliente #'+c.cliente_id}</p><p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{c.ultima_mensagem||''}</p></button>})}</div></div>
      <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col">
        {!sel?<div className="flex-1 flex items-center justify-center"><div className="text-center"><FiMessageCircle size={40} className="mx-auto text-[var(--text-muted)] mb-3"/><p className="text-[var(--text-muted)]">Selecione uma conversa</p></div></div>:<><div className="p-4 border-b border-[var(--border)]"><p className="font-medium text-[var(--text-primary)]">{sel.cliente_nome||'Cliente #'+sel.cliente_id}</p></div><div className="flex-1 overflow-y-auto p-4 space-y-3">{msgLoad?<Spinner className="py-8"/>:<>{msgs.map(function(m){var isE=m.enviado_por==='empresa';return <div key={m.id} className={'flex '+(isE?'justify-end':'justify-start')}><div className={'max-w-[70%] px-4 py-2 rounded-2xl '+(isE?'bg-[var(--accent)] text-white rounded-br-md':'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-bl-md')}><p className="text-sm">{m.mensagem}</p><p className={'text-xs mt-1 '+(isE?'text-white/60':'text-[var(--text-muted)]')}>{formatDateTime(m.data_envio)}</p></div></div>})}<div ref={bRef}/></>}</div><div className="p-3 border-t border-[var(--border)]"><form onSubmit={function(e){e.preventDefault();send();}} className="flex gap-2"><input value={newMsg} onChange={function(e){setNewMsg(e.target.value);}} placeholder="Mensagem..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"/><button type="submit" disabled={sending||!newMsg.trim()} className="px-4 py-2.5 bg-[var(--accent)] text-white rounded-xl hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"><FiSend size={18}/></button></form></div></>}
      </div>
    </div>
  </div>);
}