import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { maskCpfCnpj } from '@/utils/masks';
import { isCPF, isCNPJ } from '@/utils/validators';
import Logo from '@/components/shared/Logo';
import { Input } from '@/components/ui/Input';
import InputSenha from './InputSenha';
import { Alerta } from '@/components/ui/Alert';
import { BotaoPrimario, BotaoGhost } from '@/components/ui/Button';

export default function TelaLogin({ onCriarConta, onLoginOk, onVerificarEmail }) {
  const { login } = useAuth();
  const [doc, setDoc] = useState('');
  const [senha, setSenha] = useState('');
  const [load, setLoad] = useState(false);
  const [erro, setErro] = useState('');

  function detectarTipoDoc(valor) {
    const nums = valor.replace(/\D/g, '');
    if (nums.length === 11) return 'cpf';
    if (nums.length === 14) return 'cnpj';
    return null;
  }

  async function entrar() {
    setErro('');
    const nums = doc.replace(/\D/g, '');
    if (nums.length === 11 && !isCPF(doc)) { setErro('CPF inválido.'); return; }
    if (nums.length === 14 && !isCNPJ(doc)) { setErro('CNPJ inválido.'); return; }
    if (nums.length < 11) { setErro('Informe um CPF ou CNPJ válido.'); return; }
    if (!senha) { setErro('A senha é obrigatória.'); return; }
    setLoad(true);
    const res = await login(doc.trim(), senha);
    setLoad(false);
    if (res.success) {
      onLoginOk(res.data.user.tipo);
    } else if (res.message?.includes('não verificado') || res.message?.includes('Confirme')) {
      onVerificarEmail(res.data?.email || doc);
    } else {
      setErro(res.message || 'CPF/CNPJ ou senha incorretos.');
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-7"><Logo /></div>
      <h2 className="text-[1.3rem] font-black text-tb-text tracking-tight mb-1">Bem-vindo de volta</h2>
      <p className="text-[0.83rem] text-tb-muted2 mb-6 leading-relaxed">Entre com seu CPF ou CNPJ para acessar o painel.</p>
      <div className="flex flex-col gap-3.5">
        <Input
          label="CPF ou CNPJ"
          iconName="badge"
          placeholder="000.000.000-00  ou  00.000.000/0001-00"
          value={doc}
          onChange={e => setDoc(maskCpfCnpj(e.target.value))}
          obrigatorio
          sufixo={
            detectarTipoDoc(doc) === 'cnpj'
              ? <span className="material-icons-outlined" style={{ fontSize: 18 }}>business</span>
              : detectarTipoDoc(doc) === 'cpf'
              ? <span className="material-icons-outlined" style={{ fontSize: 18 }}>person</span>
              : null
          }
        />
        <InputSenha label="Senha" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} obrigatorio />
        {erro && <Alerta tipo="erro">{erro}</Alerta>}
        <BotaoPrimario loading={load} onClick={entrar}>Entrar</BotaoPrimario>
        <div className="flex items-center gap-3 my-0.5"><div className="flex-1 h-px bg-tb-border" /><span className="text-[0.72rem] text-tb-muted whitespace-nowrap">não tem conta?</span><div className="flex-1 h-px bg-tb-border" /></div>
        <BotaoGhost onClick={onCriarConta}>Criar uma conta</BotaoGhost>
      </div>
    </div>
  );
}
