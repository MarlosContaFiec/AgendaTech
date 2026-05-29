import React,{useEffect,useState} from 'react';
import {useParams,Link} from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import {apiVerificarEmail} from '../../services/auth';
export default function VerificarEmail(){
  const {token}=useParams();const [status,setStatus]=useState('loading');const [message,setMessage]=useState('');
  useEffect(function(){apiVerificarEmail(token).then(function(r){if(r.success){setStatus('success');setMessage('Email verificado!');}else{setStatus('error');setMessage(r.message);}});},[token]);
  return(<AuthLayout><div className="space-y-6 text-center">{status==='loading'&&<Spinner size="lg" className="py-8"/>}{status==='success'&&<><Alert type="success" message={message}/><Link to="/login/sucesso"><Button className="w-full">Continuar</Button></Link></>}{status==='error'&&<><Alert type="error" message={message}/><Link to="/login"><Button variant="secondary" className="w-full">Voltar</Button></Link></>}</div></AuthLayout>);
}
