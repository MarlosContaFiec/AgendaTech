import React from 'react';
import {Link} from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import {FiCheckCircle} from 'react-icons/fi';
export default function TelaSucesso(){
  return(<AuthLayout><div className="space-y-6 text-center"><div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--success-muted)] flex items-center justify-center"><FiCheckCircle size={32} className="text-[var(--success)]"/></div><div><h2 className="text-2xl font-bold text-[var(--text-primary)]">Tudo certo!</h2><p className="text-[var(--text-secondary)] mt-2">Conta verificada.</p></div><Link to="/login"><Button className="w-full" size="lg">Fazer Login</Button></Link></div></AuthLayout>);
}