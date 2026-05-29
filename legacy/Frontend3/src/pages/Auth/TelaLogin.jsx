import React,{useState,useContext} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import {FiUser,FiLock} from 'react-icons/fi';
import {cpf,cnpj} from '../../utils/masks';
export default function TelaLogin(){
  const {login}=useContext(AuthContext);const navigate=useNavigate();
  const [doc,setDoc]=useState('');const [senha,setSenha]=useState('');
  const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  function handleDoc(e){var v=e.target.value.replace(/\D/g,'');setDoc(v.length<=11?cpf(e.target.value):cnpj(e.target.value));}
  async function handleSubmit(e){e.preventDefault();setError('');setLoading(true);var r=await login(doc,senha);setLoading(false);if(r.success)navigate('/dashboard');else setError(r.message);}
  return(<AuthLayout><div className="space-y-6"><div><h2 className="text-2xl font-bold text-[var(--text-primary)]">Entrar</h2><p className="text-[var(--text-secondary)] mt-1">Acesse com CPF ou CNPJ</p></div><Alert type="error" message={error}/><form onSubmit={handleSubmit} className="space-y-4"><Input label="CPF ou CNPJ" icon={FiUser} value={doc} onChange={handleDoc} placeholder="000.000.000-00" maxLength={18} required/><Input label="Senha" icon={FiLock} type="password" value={senha} onChange={function(e){setSenha(e.target.value);}} placeholder="Sua senha" required/><Button type="submit" loading={loading} className="w-full" size="lg">Entrar</Button></form><p className="text-center text-sm text-[var(--text-muted)]">Nao tem conta? <Link to="/login/escolha" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">Cadastre-se</Link></p></div></AuthLayout>);
}