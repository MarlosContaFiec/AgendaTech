import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TelaVerificarEmail from '@/pages/Login/TelaVerificarEmail';
import TelaSucesso from '@/pages/Login/TelaSucesso';

export default function VerificarEmailPage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const email = params.get('email') || '';
  const tipo = params.get('tipo') || 'cliente';
  const [ok, setOk] = useState(false);

  if (ok) return <TelaSucesso tipo={tipo} onIrLogin={() => nav('/login')} />;
  return <TelaVerificarEmail email={email} tipo={tipo} onVerificado={() => setOk(true)} onTrocarEmail={() => nav('/login')} />;
}
