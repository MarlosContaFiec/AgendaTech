import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TelaLogin from './TelaLogin';
import TelaEscolhaTipo from './TelaEscolhaTipo';
import TelaCadastro from './TelaCadastro';
import TelaVerificarEmail from './TelaVerificarEmail';
import TelaSucesso from './TelaSucesso';

export default function LoginPage() {
  const nav = useNavigate();
  const [tela, setTela] = useState('login');
  const [cd, setCd] = useState({ email: '', tipo: '' });

  return (
    <>
      {tela === 'login' && <TelaLogin onCriarConta={() => setTela('escolha')} onLoginOk={() => nav('/dashboard')} />}
      {tela === 'escolha' && <TelaEscolhaTipo onEscolher={t => setTela('cadastro_' + t)} onVoltar={() => setTela('login')} />}
      {tela === 'cadastro_cliente' && <TelaCadastro tipo="cliente" onConcluir={(e, t) => { setCd({ email: e, tipo: t }); setTela('verificacao'); }} onVoltar={() => setTela('escolha')} />}
      {tela === 'cadastro_empresa' && <TelaCadastro tipo="empresa" onConcluir={(e, t) => { setCd({ email: e, tipo: t }); setTela('verificacao'); }} onVoltar={() => setTela('escolha')} />}
      {tela === 'verificacao' && <TelaVerificarEmail email={cd.email} tipo={cd.tipo} onVerificado={() => setTela('sucesso')} onTrocarEmail={() => setTela('cadastro_' + cd.tipo)} />}
      {tela === 'sucesso' && <TelaSucesso tipo={cd.tipo} onIrLogin={() => setTela('login')} />}
    </>
  );
}
