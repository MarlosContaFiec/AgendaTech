import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import Logo from "@/components/shared/Logo";
import StepIndicator from "@/components/shared/StepIndicator";

export default function TelaSucesso({ tipo, onIrLogin }) {
  const [seg, setSeg] = useState(5);
  useEffect(() => {
    if (seg <= 0) { onIrLogin(); return; }
    const t = setTimeout(() => setSeg(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seg, onIrLogin]);

  return (
    <div className="w-full max-w-[440px] bg-surface border border-line rounded-[20px] px-9 py-8 shadow-2xl animate-[fadeUp_.3s_ease]">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={2} />
      <div className="text-center py-5">
        <div className="w-[72px] h-[72px] rounded-full bg-success/12 border-2 border-success inline-flex items-center justify-center mb-5 animate-[bounceIn_.5s_ease]">
          <span className="text-[2rem] text-success">✓</span>
        </div>
        <h2 className="font-heading font-black text-[1.3rem] text-success tracking-tight mb-2">Conta criada com sucesso!</h2>
        <p className="text-[0.84rem] text-muted-light leading-relaxed mb-5">
          Verifique seu e-mail para ativar sua conta. {tipo === "empresa" ? "Após confirmar, você poderá gerenciar seus serviços." : "Após confirmar, poderá começar a agendar."}
        </p>
        <Button onClick={onIrLogin} className="w-full">Ir para o Login →</Button>
        <p className="text-[0.75rem] text-muted mt-3.5">Redirecionando em <strong className="text-muted-light">{seg}s</strong></p>
      </div>
    </div>
  );
}
