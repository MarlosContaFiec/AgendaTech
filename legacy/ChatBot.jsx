import { useState } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const perguntas = [
    { icon: "❓", texto: "Como funciona o site?" },
    { icon: "💰", texto: "Quais são os preços?" },
    { icon: "📬", texto: "Como entro em contato?" },
    { icon: "🕐", texto: "Tem suporte 24h?" },
  ];

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Chat"
        className="fixed bottom-7 right-7 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-purple to-neon border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_12px_rgba(108,92,231,0.5)] animate-[pulse_3s_ease-in-out_infinite]">
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
      </button>
      {open && (
        <div className="fixed bottom-24 right-7 z-[9998] w-[340px] bg-surface border border-line rounded-[20px] overflow-hidden shadow-2xl animate-[fadeUp_.25s_ease]">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-xl bg-purple/15 border border-purple/25 flex items-center justify-center text-lg">💬</div>
              <div>
                <div className="font-body text-[0.9rem] font-bold text-foreground">Assistente Virtual</div>
                <div className="flex items-center gap-1 text-[0.7rem] text-muted"><span className="w-1.5 h-1.5 rounded-full bg-success" />Online agora</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="bg-none border-none cursor-pointer text-muted hover:text-foreground p-1 rounded-lg transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="px-4 pt-4 pb-2">
            <div className="bg-white/4 border border-line rounded-[14px] rounded-tl-[4px] py-3 px-3.5 text-[0.83rem] text-muted-light leading-relaxed">
              Olá! Sou o assistente do <strong className="text-foreground">AgendaTech</strong>.<br />Como posso te ajudar hoje?
            </div>
          </div>
          <div className="px-4 py-3 flex flex-col gap-1.5">
            <div className="text-[0.66rem] text-muted uppercase tracking-widest mb-1 px-0.5">Perguntas frequentes</div>
            {perguntas.map((p, i) => (
              <button key={i} className="bg-white/3 border border-line rounded-xl py-2.5 px-3.5 cursor-pointer flex items-center gap-2.5 transition-all hover:bg-purple/10 hover:border-purple/35 text-left w-full group">
                <span className="text-sm flex-shrink-0">{p.icon}</span>
                <span className="text-[0.82rem] text-muted-light transition-colors group-hover:text-foreground flex-1">{p.texto}</span>
                <svg className="text-line flex-shrink-0 transition-all group-hover:text-purple/60 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ))}
          </div>
          <div className="mx-4 mb-3.5 pt-3 border-t border-line/50 text-center text-[0.67rem] text-line-light">
            Respostas em segundos · <span className="text-purple/70">AgendaTech</span>
          </div>
        </div>
      )}
    </>
  );
}
