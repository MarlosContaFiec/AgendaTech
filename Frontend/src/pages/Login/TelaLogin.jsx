import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Alert } from "@/components/ui";
import Logo from "@/components/shared/Logo";
import InputSenha from "./InputSenha";
import { isEmail } from "@/utils/validators";

export default function TelaLogin({ onCriarConta, onLoginOk }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { login } = useAuth();

  async function fazerLogin() {
    setErro("");
    if (!isEmail(email)) { setErro("Informe um e-mail válido."); return; }
    if (!senha) { setErro("A senha é obrigatória."); return; }
    setLoading(true);
    const res = await login(email, senha);
    setLoading(false);
    if (res.success) {
      onLoginOk();
    } else {
      if (res.message && res.message.includes("verificado")) {
        setErro("Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.");
      } else {
        setErro(res.message || "E-mail ou senha incorretos.");
      }
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-surface border border-line rounded-[20px] px-9 py-8 shadow-2xl animate-[fadeUp_.3s_ease]">
      <div className="mb-7"><Logo /></div>
      <h2 className="font-heading font-black text-[1.3rem] tracking-tight mb-1">Bem-vindo de volta</h2>
      <p className="text-[0.83rem] text-muted-light mb-6 leading-relaxed">Entre com seu e-mail para acessar.</p>
      <div className="flex flex-col gap-3.5">
        <Input label="E-mail" icon="✉️" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <InputSenha label="Senha" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} />
        {erro && <Alert type="error">{erro}</Alert>}
        <Button loading={loading} disabled={loading} onClick={fazerLogin} className="w-full">Entrar →</Button>
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-line" />
          <span className="text-[0.72rem] text-muted whitespace-nowrap">não tem conta?</span>
          <div className="flex-1 h-px bg-line" />
        </div>
        <Button variant="ghost" onClick={onCriarConta} className="w-full">Criar uma conta</Button>
      </div>
    </div>
  );
}
