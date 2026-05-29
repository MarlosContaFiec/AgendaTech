import { useState } from 'react';

const perguntas = [
  { icon: '❓', texto: 'Como funciona o site?' },
  { icon: '💰', texto: 'Quais são os preços?' },
  { icon: '📬', texto: 'Como entro em contato?' },
  { icon: '🕐', texto: 'Tem suporte 24h?' },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const btnClass = 'fixed bottom-7 right-7 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 border-none cursor-pointer flex items-center justify-center transition-transform duration-200 hover:scale-110 shadow-lg';

  return (
    <>
      <style>{'@keyframes chatPulse{0%,100%{box-shadow:0 0 0 0 rgba(91,108,255,.4)}50%{box-shadow:0 0 0 8px rgba(91,108,255,0)}}'}</style>

      <button onClick={() => setOpen(!open)} className={btnClass} style={{ animation: 'chatPulse 3s ease-in-out infinite' }}>
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }
      </button>

      {open && (
        <div className="fixed bottom-24 right-7 z-[9998] w-[340px] bg-tb-surface border border-tb-border rounded-[20px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.7)] animate-fadeUp">
          <div className="px-5 py-[18px] border-b border-tb-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-xl bg-tb-accent/15 border border-tb-accent/25 flex items-center justify-center text-lg flex-shrink-0">💬</div>
              <div className="flex flex-col gap-0.5">
                <span className="text-tb-text text-[0.9rem] font-bold leading-none">Assistente Virtual</span>
                <span className="flex items-center gap-1.5 text-[0.7rem] text-tb-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-tb-green flex-shrink-0" />Online agora
                </span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="bg-none border-none cursor-pointer text-tb-muted flex items-center justify-center p-1 rounded-lg hover:text-tb-text hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="px-4 pt-4 pb-2">
            <div className="bg-white/[0.04] border border-tb-border rounded-[14px] rounded-tl-[4px] py-3 px-3.5 text-[0.83rem] text-slate-300 leading-relaxed">
              Olá! Sou o assistente do <strong className="text-tb-text">TrustBook</strong>.<br/>Como posso te ajudar hoje?
            </div>
          </div>
          <div className="px-4 py-3 flex flex-col gap-1.5">
            <div className="text-[0.66rem] text-tb-muted uppercase tracking-[0.08em] mb-1 px-0.5">Perguntas frequentes</div>
            {perguntas.map((p, i) => (
              <button key={i} className="bg-white/[0.03] border border-tb-border rounded-xl py-2.5 px-3.5 cursor-pointer flex items-center gap-2.5 transition-all duration-150 text-left w-full hover:bg-tb-accent/10 hover:border-tb-accent/35 group">
                <span className="text-[15px] flex-shrink-0">{p.icon}</span>
                <span className="text-[0.82rem] text-slate-300 transition-colors group-hover:text-tb-text">{p.texto}</span>
                <svg className="ml-auto text-tb-border flex-shrink-0 transition-all duration-150 group-hover:text-tb-accent/60 group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            ))}
          </div>
          <div className="mx-4 mb-3.5 pt-3 border-t border-slate-800 text-center text-[0.67rem] text-slate-700">
            Respostas em segundos • <span className="text-tb-accent/70">TrustBook</span>
          </div>
        </div>
      )}
    </>
  );
}
