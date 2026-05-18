import { useState } from "react";
import Logo from "@/components/shared/Logo";

const opcoes = [
  { id: "cliente", icon: "👤", titulo: "Sou Cliente", desc: "Quero agendar serviços e gerenciar meus horários.", grad: "from-purple to-neon", cor: "text-purple" },
  { id: "empresa", icon: "🏢", titulo: "Sou Empresa", desc: "Quero gerenciar agendamentos e cadastrar serviços.", grad: "from-purple to-neon" },
];

export default function TelaEscolhaTipo({ onEscolher, onVoltar }) {
  const [hover, setHover] = useState(null);
  return (
    <div className="w-full max-w-[480px] bg-surface border border-line rounded-[20px] px-9 py-8 shadow-2xl animate-[fadeUp_.3s_ease]">
      <div className="mb-6"><Logo /></div>
      <h2 className="font-heading font-black text-[1.25rem] tracking-tight mb-1">Criar nova conta</h2>
      <p className="text-[0.83rem] text-muted-light mb-5">Como você vai usar o AgendaTech?</p>
      <div className="flex flex-col gap-3 mb-5">
        {opcoes.map(op => (
          <div key={op.id} onClick={() => onEscolher(op.id)} onMouseEnter={() => setHover(op.id)} onMouseLeave={() => setHover(null)}
            className={"bg-surface-alt border rounded-[14px] py-4 px-5 cursor-pointer flex items-center gap-4 transition-all " + (hover === op.id ? "border-purple/60 bg-surface-hover shadow-lg shadow-purple/10" : "border-line-light")}>
            <div className={"w-12 h-12 rounded-[14px] flex-shrink-0 bg-gradient-to-br " + op.grad + " flex items-center justify-center text-[1.5rem] shadow-lg transition-transform " + (hover === op.id ? "scale-110" : "")}>{op.icon}</div>
            <div className="flex-1">
              <div className="font-black text-[0.96rem]">{op.titulo}</div>
              <div className="text-[0.78rem] text-muted-light leading-relaxed">{op.desc}</div>
            </div>
            <span className={"text-xl transition-all " + (hover === op.id ? "text-purple translate-x-1" : "text-muted")}>›</span>
          </div>
        ))}
      </div>
      <button onClick={onVoltar} className="bg-none border-none cursor-pointer text-muted text-[0.82rem] font-medium hover:text-purple transition-colors">← Voltar para o login</button>
    </div>
  );
}
