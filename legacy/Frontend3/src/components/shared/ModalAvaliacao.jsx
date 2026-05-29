import React,{useState} from 'react';
import {FiStar} from 'react-icons/fi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import {api} from '../../services/api';
export default function ModalAvaliacao({open,onClose,agendamentoId,token,onSaved}){
  const [estrelas,setEstrelas]=useState(0);const [hover,setHover]=useState(0);
  const [feedback,setFeedback]=useState('');const [loading,setLoading]=useState(false);
  async function submit(){if(estrelas===0)return;setLoading(true);var r=await api('POST','/api/avaliacoes/agendamento/'+agendamentoId,{estrelas:estrelas,feedback:feedback},token);setLoading(false);if(r.success){onSaved&&onSaved();onClose();setEstrelas(0);setFeedback('');}}
  return(<Modal open={open} onClose={onClose} title="Avaliar"><div className="space-y-5"><div className="flex justify-center gap-2">{[1,2,3,4,5].map(function(s){return <button key={s} onMouseEnter={function(){setHover(s);}} onMouseLeave={function(){setHover(0);}} onClick={function(){setEstrelas(s);}} className="transition-transform hover:scale-110"><FiStar size={32} className={s<=(hover||estrelas)?'text-amber-400 fill-amber-400':'text-[var(--border)]'}/></button>})}</div><Textarea label="Feedback (opcional)" value={feedback} onChange={function(e){setFeedback(e.target.value);}} rows={3}/><div className="flex gap-3 justify-end"><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button onClick={submit} loading={loading} disabled={estrelas===0}>Enviar</Button></div></div></Modal>);
}
