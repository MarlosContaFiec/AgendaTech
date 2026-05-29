import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import {apiReenviarVerificacao} from '../../services/auth';
import {FiMail} from 'react-icons/fi';
export default function TelaVerificarEmail(){
  const [email]=useState(localStorage.getItem('pending_email')||'');
  const [msg,setMsg]=useState('');const [err,setErr]=useState('');const [loading,setLoading]=useState(false);
  async function resend(){setErr('');setMsg('');setLoading(true);var r=await apiReenviarVerificacao(email);setLoading(false);if(r.success)setMsg('Email reenviado!');else setErr(r.message);}
  return(<AuthLayout><div className="space-y-6 text-center"><div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center"><FiMail size={32} className="text-[var(--accent)]"/></div><div><h2 className="text-2xl font-bold text-[var(--text-primary)]">Verifique seu email</h2><p className="text-[var(--text-secondary)] mt-2">Link enviado para <strong className="text-[var(--text-primary)]">{email}</strong></p></div><Alert type="success" message={msg}/><Alert type="error" message={err}/><div className="space-y-3"><Button onClick={resend} loading={loading} variant="secondary" className="w-full">Reenviar</Button><Link to="/login"><Button variant="ghost" className="w-full">Voltar ao login</Button></Link></div></div></AuthLayout>);
}