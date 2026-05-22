import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { maskCPF, maskCNPJ } from '@/utils/masks';
import { isCPF, isCNPJ, isEmailValido } from '@/utils/validators';
import Logo from '@/components/shared/Logo';
import StepIndicator from '@/components/shared/StepIndicator';
import PasswordStrength from '@/components/shared/PasswordStrength';
import { Input } from '@/components/ui/Input';
import InputSenha from './InputSenha';
import { Alerta } from '@/components/ui/Alert';
import { BotaoPrimario, BotaoLink } from '@/components/ui/Button';

export default function TelaCadastro({ tipo, onConcluir, onVoltar }) {
  const { cadastrarCliente, cadastrarEmpresa } = useAuth();
  const emp = tipo === 'empresa';

  const [f, setF] = useState(emp
    ? { nome_fantasia: '', razao_social: '', cnpj: '', email: '', senha: '', confirma: '' }
    : { nome: '', cpf: '', email: '', senha: '', confirma: '' });
  const [e, setE] = useState({});
  const [load, setLoad] = useState(false);
  const [apiErr, setApiErr] = useState('');

  function upd(k, v) { setF(p => ({ ...p, [k]: v })); setE(p => ({ ...p, [k]: '' })); }

  function validar() {
    const er = {};
    if (emp) {
      if (f.razao_social.trim().length < 3) er.razao_social = 'Razão social obrigatória.';
      if (f.nome_fantasia.trim().length < 2) er.nome_fantasia = 'Nome fantasia obrigatório.';
      if (!isCNPJ(f.cnpj)) er.cnpj = 'CNPJ inválido.';
    } else {
      const p = f.nome.trim().split(/\s+/);
      if (p.length < 2 || p.some(x => x.length < 2)) er.nome = 'Informe nome e sobrenome.';
      if (!isCPF(f.cpf)) er.cpf = 'CPF inválido.';
    }
    if (!isEmailValido(f.email)) er.email = 'E-mail inválido.';
    if (f.senha.length < 8) er.senha = 'Mínimo de 8 caracteres.';
    if (f.senha !== f.confirma) er.confirma = 'As senhas não coincidem.';
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoad(true); setApiErr('');
    const res = emp
      ? await cadastrarEmpresa({ razao_social: f.razao_social.trim(), nome_fantasia: f.nome_fantasia.trim(), cnpj: f.cnpj, email: f.email.trim().toLowerCase(), senha: f.senha })
      : await cadastrarCliente({ nome: f.nome.trim(), cpf: f.cpf, email: f.email.trim().toLowerCase(), senha: f.senha });
    setLoad(false);
    if (res.success) onConcluir(f.email.trim().toLowerCase(), tipo, res.data);
    else setApiErr(res.message || 'Erro ao criar conta.');
  }

  return (
    <div className="w-full max-w-[500px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={['Dados','Verificação','Pronto']} atual={0} />
      <div className="flex items-center gap-2.5 mb-[22px]">
        <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center ${emp ? 'bg-gradient-to-br from-tb-violet to-pink-500' : 'bg-gradient-to-br from-tb-accent to-indigo-500'}`}>
          <span className="material-icons-outlined" style={{ fontSize: 20 }}>{emp ? 'business' : 'person'}</span>
        </div>
        <div>
          <h2 className="text-[1.1rem] font-black text-tb-text tracking-tight">Criar conta — {emp ? 'Empresa' : 'Cliente'}</h2>
          <p className="text-[0.75rem] text-tb-muted2">{emp ? 'Dados do estabelecimento' : 'Preencha seus dados'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        {emp ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Razão Social" placeholder="Empresa Ltda." value={f.razao_social} onChange={v => upd('razao_social', v.target.value)} erro={e.razao_social} obrigatorio />
              <Input label="Nome Fantasia" placeholder="Meu Negócio" value={f.nome_fantasia} onChange={v => upd('nome_fantasia', v.target.value)} erro={e.nome_fantasia} obrigatorio />
            </div>
            <Input label="CNPJ" placeholder="00.000.000/0001-00" value={f.cnpj} onChange={v => upd('cnpj', maskCNPJ(v.target.value))} erro={e.cnpj} obrigatorio />
          </>
        ) : (
          <>
            <Input label="Nome Completo" placeholder="Ex: Maria Silva" value={f.nome} onChange={v => upd('nome', v.target.value)} erro={e.nome} obrigatorio />
            <Input label="CPF" placeholder="000.000.000-00" value={f.cpf} onChange={v => upd('cpf', maskCPF(v.target.value))} erro={e.cpf} obrigatorio />
          </>
        )}
        <Input label="E-mail" type="email" placeholder="seu@email.com" value={f.email} onChange={v => upd('email', v.target.value)} erro={e.email} obrigatorio />
        <InputSenha label="Senha" placeholder="Mínimo 8 caracteres" value={f.senha} onChange={v => upd('senha', v.target.value)} erro={e.senha} obrigatorio />
        <PasswordStrength senha={f.senha} />
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha" value={f.confirma} onChange={v => upd('confirma', v.target.value)} erro={e.confirma} obrigatorio />
        {apiErr && <Alerta tipo="erro">{apiErr}</Alerta>}
        <BotaoPrimario loading={load} onClick={submeter}>Criar Conta e Verificar E-mail</BotaoPrimario>
      </div>
      <div className="mt-4"><BotaoLink onClick={onVoltar}>← Voltar</BotaoLink></div>
    </div>
  );
}
