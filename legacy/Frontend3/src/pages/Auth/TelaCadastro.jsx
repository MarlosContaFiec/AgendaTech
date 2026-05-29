import React,{useState} from 'react';
import {useParams,useNavigate,Link} from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import StepIndicator from '../../components/shared/StepIndicator';
import PasswordStrength from '../../components/shared/PasswordStrength';
import {apiRegisterCliente,apiRegisterEmpresa} from '../../services/auth';
import {cpf,cnpj,phone,cep} from '../../utils/masks';
import {validateCPF,validateCNPJ,validateEmail,validatePassword} from '../../utils/validators';
import {FiUser,FiMail,FiLock,FiPhone,FiCalendar,FiMapPin} from 'react-icons/fi';
export default function TelaCadastro(){
  const {tipo}=useParams();const navigate=useNavigate();const isEmp=tipo==='empresa';
  const [step,setStep]=useState(1);const [form,setForm]=useState({});const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  var steps=isEmp?['Dados','Empresa','Senha']:['Dados','Pessoal','Senha'];
  function s(f,v){setForm(function(p){var n=Object.assign({},p);n[f]=v;return n;});}
  function mask(f,fn){return function(e){s(f,fn(e.target.value));};}
  function validate(){
    setError('');
    if(step===1){if(!validateEmail(form.email||'')){setError('Email invalido');return false;}
      if(isEmp){if(!validateCNPJ(form.cnpj||'')){setError('CNPJ invalido');return false;}if(!form.razao_social){setError('Razao social obrigatoria');return false;}if(!form.nome_fantasia){setError('Nome fantasia obrigatorio');return false;}}
      else{if(!form.nome){setError('Nome obrigatorio');return false;}}}
    if(step===2&&!isEmp){if((form.cpf||'').replace(/\D/g,'').length>0&&!validateCPF(form.cpf||'')){setError('CPF invalido');return false;}}
    if(step===3){if(!validatePassword(form.senha||'')){setError('Minimo 6 caracteres');return false;}if(form.senha!==form.confirmarSenha){setError('Senhas nao conferem');return false;}}
    return true;
  }
  function next(){if(validate())setStep(function(x){return x+1;});}
  async function submit(){if(!validate())return;setLoading(true);setError('');
    var res;if(isEmp)res=await apiRegisterEmpresa({email:form.email,senha:form.senha,cnpj:form.cnpj,razao_social:form.razao_social,nome_fantasia:form.nome_fantasia,telefone:form.telefone,cep:form.cep});
    else res=await apiRegisterCliente({nome:form.nome,email:form.email,senha:form.senha,cpf:form.cpf,telefone:form.telefone,data_nascimento:form.data_nascimento});
    setLoading(false);if(res.success){localStorage.setItem('pending_email',form.email);navigate('/login/verificar');}else setError(res.message);
  }
  return(<AuthLayout><div className="space-y-6"><div className="text-center"><h2 className="text-2xl font-bold text-[var(--text-primary)]">Cadastro {isEmp?'Empresa':'Cliente'}</h2></div><StepIndicator steps={steps} current={step-1}/><Alert type="error" message={error}/>
    {step===1&&<div className="space-y-4"><Input label="Email" icon={FiMail} type="email" value={form.email||''} onChange={function(e){s('email',e.target.value);}} placeholder="seu@email.com" required/>{isEmp?<><Input label="CNPJ" value={form.cnpj||''} onChange={mask('cnpj',cnpj)} placeholder="00.000.000/0000-00" maxLength={18} required/><Input label="Razao Social" value={form.razao_social||''} onChange={function(e){s('razao_social',e.target.value);}} required/><Input label="Nome Fantasia" value={form.nome_fantasia||''} onChange={function(e){s('nome_fantasia',e.target.value);}} required/></>:<Input label="Nome Completo" icon={FiUser} value={form.nome||''} onChange={function(e){s('nome',e.target.value);}} placeholder="Seu nome" required/>}<Button onClick={next} className="w-full">Proximo</Button></div>}
    {step===2&&<div className="space-y-4">{isEmp?<><Input label="Telefone" icon={FiPhone} value={form.telefone||''} onChange={mask('telefone',phone)} placeholder="(00) 00000-0000"/><Input label="CEP" icon={FiMapPin} value={form.cep||''} onChange={mask('cep',cep)} placeholder="00000-000"/></>:<><Input label="CPF" value={form.cpf||''} onChange={mask('cpf',cpf)} placeholder="000.000.000-00" maxLength={14}/><Input label="Telefone" icon={FiPhone} value={form.telefone||''} onChange={mask('telefone',phone)} placeholder="(00) 00000-0000"/><Input label="Nascimento" icon={FiCalendar} type="date" value={form.data_nascimento||''} onChange={function(e){s('data_nascimento',e.target.value);}}/></>}<div className="flex gap-3"><Button variant="secondary" onClick={function(){setStep(1);}} className="flex-1">Voltar</Button><Button onClick={next} className="flex-1">Proximo</Button></div></div>}
    {step===3&&<div className="space-y-4"><div><Input label="Senha" icon={FiLock} type="password" value={form.senha||''} onChange={function(e){s('senha',e.target.value);}} placeholder="Minimo 6 caracteres" required/><div className="mt-2"><PasswordStrength password={form.senha}/></div></div><Input label="Confirmar" icon={FiLock} type="password" value={form.confirmarSenha||''} onChange={function(e){s('confirmarSenha',e.target.value);}} placeholder="Repita" required/><div className="flex gap-3"><Button variant="secondary" onClick={function(){setStep(2);}} className="flex-1">Voltar</Button><Button onClick={submit} loading={loading} className="flex-1">Cadastrar</Button></div></div>}
  <p className="text-center text-sm text-[var(--text-muted)]">Ja tem conta? <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">Entrar</Link></p></div></AuthLayout>);
}