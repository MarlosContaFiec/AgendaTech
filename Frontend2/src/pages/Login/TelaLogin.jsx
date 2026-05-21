import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { maskCPF, maskCNPJ } from '@/utils/masks';
import { isCPF, isCNPJ } from '@/utils/validators';
import Logo from '@/components/shared/Logo';
import { Input } from '@/components/ui/Input';
import { InputSenha } from './InputSenha';
import { Alerta } from '@/components/ui/Alert';
import { BotaoPrimario, BotaoGhost } from '@/components/ui/Button';

function Divisor({ texto }) {
  return (
    <div className="flex items-center gap-3 my-0.5">
      <div className="flex-1 h-px bg-tb-border" />
      {texto && <span className="text-[0.72rem] text-tb-muted whitespace-nowrap">{texto}</span>}
      <div className="flex-1 h-px bg-tb-border" />
    </div>
  );
}

export default function TelaLogin({ onCriarConta, onLoginOk }) {
  const { login } = useAuth();
  const [doc, setDoc] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const tipo = isCNPJ(doc) ? 'empresa' : isCPF(doc) ? 'cliente' : null;

  function digitar(e) {
    const r = e.target.value.replace(/\D/g, '');
    setDoc(r.length <= 11 ? maskCPF(r) : maskCNPJ(r));
  }

  async function fazerLogin() {
    setErro('');
    if (!tipo) { setErro('Informe um CPF ou CNPJ válido.'); return; }
    if (!senha) { setErro('A senha é obrigatória.'); return; }
    setLoading(true);
    const res = await login(doc.replace(/\D/g, ''), senha);
    setLoading(false);
    if (res.success) onLoginOk(res.data?.user?.tipo || tipo);
    else setErro(res.message || 'CPF/CNPJ ou senha incorretos.');
  }

  return (
    <div className="w-full max-w-[440px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-7"><Logo /></div>
      <h2 className="text-[1.3rem] font-black text-tb-text tracking-tight mb-1">Bem-vindo de volta</h2>
      <p className="text-[0.83rem] text-tb-muted2 mb-6 leading-relaxed">Entre com seu CPF ou CNPJ para acessar.</p>
      <div className="flex flex-col gap-3.5">
        <Input label="CPF ou CNPJ" icone={<span className='material-icons-outlined' style={{fontSize: 25}}>person</span>} placeholder="000.000.000-00  ou  00.000.000/0001-00" value={doc} onChange={digitar} obrigatorio sufixo={tipo === 'empresa' ? '🏢' : tipo === 'cliente' ? <span className='material-icons-outlined'>face</span> : null} />
        {tipo && (
          <div className={'flex items-center gap-2 py-2 px-3 rounded-[9px] border animate-fadeUp ' + (tipo === 'empresa' ? 'bg-tb-violet/10 border-tb-violet/30' : 'bg-tb-accent/10 border-tb-accent/30')}>
            <span className="text-[0.88rem]">{tipo === 'empresa' ? '🏢' : '👤'}</span>
            <span className={'text-[0.79rem] font-semibold ' + (tipo === 'empresa' ? 'text-tb-violet' : 'text-tb-accent')}>
              {tipo === 'empresa' ? 'Entrando como Empresa' : 'Entrando como Cliente'}
            </span>
          </div>
        )}
        <InputSenha label="Senha" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} obrigatorio />
        {erro && <Alerta tipo="erro">{erro}</Alerta>}
        <BotaoPrimario loading={loading} onClick={fazerLogin}>Entrar →</BotaoPrimario>
        <Divisor texto="não tem conta?" />
        <BotaoGhost onClick={onCriarConta}>Criar uma conta</BotaoGhost>
      </div>
    </div>
  );
}
