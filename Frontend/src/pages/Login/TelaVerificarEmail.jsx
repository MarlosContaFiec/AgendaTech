import { useState } from "react";
import { Button } from "@/components/ui";
import Logo from "@/components/shared/Logo";
import StepIndicator from "@/components/shared/StepIndicator";
import api from "@/services/api";

export default function TelaVerificarEmail({ email, tipo, onVoltar }) {
  const [reenviando, setReenviando] = useState(false);
  const [msg, setMsg] = useState("");

  async function reenviar() {
    setReenviando(true);
    const res = await api("POST", "/api/auth/reenviar-verificacao", { email });
    setReenviando(false);
    setMsg(res.success ? "E-mail reenviado! Verifique sua caixa de entrada." : (res.message || "Erro ao reenviar."));
  }

  return (
    <div className="w-full max-w-[440px] bg-surface border border-line rounded-[20px] px-9 py-8 shadow-2xl animate-[fadeUp_.3s_ease]">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={1} />
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-[18px] bg-purple/18 border border-purple/35 inline-flex items-center justify-center text-[1.9rem] mb-4 animate-[bounceIn_.4s_ease]">✉️</div>
        <h2 className="font-heading font-black text-[1.2rem] tracking-tight mb-2">Verifique seu e-mail</h2>
        <p className="text-[0.82rem] text-muted-light leading-relaxed">Enviamos um link de confirmação para<br /><strong className="text-purple">{email}</strong></p>
      </div>
      <div className="bg-surface-alt border border-line rounded-xl p-4 mb-5 text-[0.82rem] text-muted-light leading-relaxed">
        <p className="mb-2">Abra seu e-mail e <strong className="text-foreground">clique no link</strong> para ativar sua conta.</p>
        <p>O link expira em <strong className="text-warning">24 horas</strong>.</p>
      </div>
      {msg && <div className="bg-success/10 border border-success/25 rounded-lg py-2.5 px-3.5 text-[0.82rem] text-success mb-4">{msg}</div>}
      <div className="flex flex-col gap-3">
        <Button variant="ghost" disabled={reenviando} onClick={reenviar} className="w-full">{reenviando ? "Reenviando..." : "📨 Reenviar e-mail de verificação"}</Button>
      </div>
      <div className="mt-4"><button onClick={onVoltar} className="bg-none border-none cursor-pointer text-muted text-[0.82rem] font-medium hover:text-purple transition-colors">← Voltar ao login</button></div>
    </div>
  );
}
