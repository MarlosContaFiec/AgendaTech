import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Alert, Spinner } from "@/components/ui";
import Logo from "@/components/shared/Logo";
import StepIndicator from "@/components/shared/StepIndicator";
import PasswordStrength from "@/components/shared/PasswordStrength";
import InputSenha from "./InputSenha";
import api from "@/services/api";
import { maskCPF, maskCNPJ, maskPhone } from "@/utils/masks";
import { isCPF, isCNPJ, isEmail } from "@/utils/validators";
import { FiUser, FiBriefcase, FiCreditCard, FiPhone, FiMapPin, FiEdit3, FiMail, FiCalendar } from "react-icons/fi";

export default function TelaCadastro({ tipo, onConcluir, onVoltar }) {
  const emp = tipo === "empresa";
  const [f, setF] = useState(emp
    ? { razao: "", fantasia: "", cnpj: "", email: "", telefone: "", cep: "", senha: "", confirma: "" }
    : { nome: "", cpf: "", email: "", telefone: "", nascimento: "", senha: "", confirma: "" }
  );
  const [e, setE] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErro, setApiErro] = useState("");

  function upd(k, v) { setF(p => ({ ...p, [k]: v })); setE(p => ({ ...p, [k]: "" })); }

  function validar() {
    const er = {};
    if (emp) {
      if (f.razao.trim().length < 3) er.razao = "Razão social obrigatória.";
      if (f.fantasia.trim().length < 2) er.fantasia = "Nome fantasia obrigatório.";
      if (!isCNPJ(f.cnpj)) er.cnpj = "CNPJ inválido. Formato: 00.000.000/0001-00";
    } else {
      const partes = f.nome.trim().split(/\s+/);
      if (partes.length < 2 || partes.some(p => p.length < 2)) er.nome = "Informe nome e sobrenome completos.";
      if (f.cpf && !isCPF(f.cpf)) er.cpf = "CPF inválido. Formato: 000.000.000-00";
    }
    if (!isEmail(f.email)) er.email = "E-mail inválido.";
    if (f.senha.length < 6) er.senha = "Mínimo de 6 caracteres.";
    if (f.senha !== f.confirma) er.confirma = "As senhas não coincidem.";
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoading(true); setApiErro("");
    const endpoint = emp ? "/api/auth/register/empresa" : "/api/auth/register/cliente";
    const body = emp
      ? { email: f.email.trim().toLowerCase(), senha: f.senha, cnpj: f.cnpj, razao_social: f.razao.trim(), nome_fantasia: f.fantasia.trim(), telefone: f.telefone || undefined, cep: f.cep || undefined }
      : { nome: f.nome.trim(), email: f.email.trim().toLowerCase(), senha: f.senha, cpf: f.cpf || undefined, telefone: f.telefone || undefined, data_nascimento: f.nascimento || undefined };
    const res = await api("POST", endpoint, body);
    setLoading(false);
    if (res.success) onConcluir(f.email.trim().toLowerCase(), tipo);
    else setApiErro(res.message || "Erro ao criar conta.");
  }

  const IconTipo = emp ? FiBriefcase : FiUser;

  return (
    <div className="w-full max-w-[500px] bg-surface border border-line rounded-[20px] px-9 py-8 shadow-2xl animate-[fadeUp_.3s_ease]">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={0} />
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-purple to-neon flex items-center justify-center flex-shrink-0">
          <IconTipo size={18} color="white" />
        </div>
        <div>
          <h2 className="font-heading font-black text-[1.1rem] tracking-tight">Criar conta — {emp ? "Empresa" : "Cliente"}</h2>
          <p className="text-[0.75rem] text-muted-light">{emp ? "Dados do seu estabelecimento" : "Preencha seus dados pessoais"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {emp ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Razão Social" placeholder="Empresa Ltda." value={f.razao} onChange={v => upd("razao", v.target.value)} error={e.razao} required />
              <Input label="Nome Fantasia" placeholder="Meu Negócio" value={f.fantasia} onChange={v => upd("fantasia", v.target.value)} error={e.fantasia} required />
            </div>
            <Input label="CNPJ" icon={<FiCreditCard size={16} />} placeholder="00.000.000/0001-00" value={f.cnpj} onChange={v => upd("cnpj", maskCNPJ(v.target.value))} error={e.cnpj} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Telefone" icon={<FiPhone size={16} />} placeholder="(11) 99999-0000" value={f.telefone} onChange={v => upd("telefone", maskPhone(v.target.value))} />
              <Input label="CEP" icon={<FiMapPin size={16} />} placeholder="13330-000" value={f.cep} onChange={v => upd("cep", v.target.value)} />
            </div>
          </>
        ) : (
          <>
            <Input label="Nome Completo" icon={<FiEdit3 size={16} />} placeholder="Maria Silva Santos" value={f.nome} onChange={v => upd("nome", v.target.value)} error={e.nome} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="CPF" icon={<FiCreditCard size={16} />} placeholder="000.000.000-00" value={f.cpf} onChange={v => upd("cpf", maskCPF(v.target.value))} error={e.cpf} />
              <Input label="Telefone" icon={<FiPhone size={16} />} placeholder="(11) 99999-0000" value={f.telefone} onChange={v => upd("telefone", maskPhone(v.target.value))} />
            </div>
            <Input label="Data de Nascimento" icon={<FiCalendar size={16} />} type="date" value={f.nascimento} onChange={v => upd("nascimento", v.target.value)} />
          </>
        )}
        <Input label="E-mail" icon={<FiMail size={16} />} type="email" placeholder="seu@email.com" value={f.email} onChange={v => upd("email", v.target.value)} error={e.email} required />
        <InputSenha label="Senha" placeholder="Mínimo 6 caracteres" value={f.senha} onChange={v => upd("senha", v.target.value)} required />
        <PasswordStrength senha={f.senha} />
        {e.senha && <p className="text-[0.72rem] text-danger flex items-center gap-1"><span>!</span>{e.senha}</p>}
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha" value={f.confirma} onChange={v => upd("confirma", v.target.value)} required />
        {e.confirma && <p className="text-[0.72rem] text-danger flex items-center gap-1"><span>!</span>{e.confirma}</p>}
        {apiErro && <Alert type="error">{apiErro}</Alert>}
        <Button disabled={loading} onClick={submeter} className="w-full">
          {loading ? <><Spinner size={14} /> Aguarde...</> : "Criar Conta →"}
        </Button>
      </div>
      <div className="mt-4">
        <button onClick={onVoltar} className="bg-none border-none cursor-pointer text-muted text-[0.82rem] font-medium hover:text-purple transition-colors">← Voltar</button>
      </div>
    </div>
  );
}
