import { useState } from 'react';
import Logo from '@/components/shared/Logo';
import { BotaoLink } from '@/components/ui/Button';

export default function TelaEscolhaTipo({ onEscolher, onVoltar }) {
  const [hov, setHov] = useState(null);
  const ops = [
    { id:'cliente', ic:'👤', tit:'Sou Cliente', desc:'Quero agendar serviços e gerenciar meu histórico.', grad:'from-tb-accent to-indigo-500', cor:'text-tb-accent', bdr:'border-tb-accent', somb:'shadow-[0_6px_28px_rgba(79,140,255,0.25)]', isomb:'shadow-[0_4px_18px_rgba(79,140,255,0.25)]' },
    { id:'empresa', ic:'🏢', tit:'Sou Empresa', desc:'Quero gerenciar agendamentos e cadastrar serviços.', grad:'from-tb-violet to-pink-500', cor:'text-tb-violet', bdr:'border-tb-violet', somb:'shadow-[0_6px_28px_rgba(167,139,250,0.25)]', isomb:'shadow-[0_4px_18px_rgba(167,139,250,0.25)]' },
  ];
  return (
    <div className="w-full max-w-[480px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-6"><Logo /></div>
      <h2 className="text-[1.25rem] font-black text-tb-text tracking-tight mb-1">Criar nova conta</h2>
      <p className="text-[0.83rem] text-tb-muted2 mb-[22px] leading-relaxed">Como você vai usar o TrustBook?</p>
      <div className="flex flex-col gap-3 mb-5">
        {ops.map(o => (
          <div key={o.id} onClick={() => onEscolher(o.id)} onMouseEnter={() => setHov(o.id)} onMouseLeave={() => setHov(null)}
            className={'bg-tb-surface2 border-[1.5px] rounded-[14px] py-[18px] px-5 cursor-pointer flex items-center gap-4 transition-all duration-200 ' + (hov === o.id ? 'bg-tb-surface3 ' + o.bdr + ' ' + o.somb : 'border-tb-border2')}>
            <div className={'w-[52px] h-[52px] rounded-[14px] flex-shrink-0 bg-gradient-to-br ' + o.grad + ' flex items-center justify-center text-[1.5rem] ' + o.isomb + ' transition-transform duration-200 ' + (hov === o.id ? 'scale-110' : 'scale-100')}>{o.ic}</div>
            <div className="flex-1">
              <div className="font-extrabold text-[0.96rem] text-tb-text mb-[3px]">{o.tit}</div>
              <div className="text-[0.78rem] text-tb-muted2 leading-relaxed">{o.desc}</div>
            </div>
            <span className={'text-[1.2rem] transition-all duration-200 ' + (hov === o.id ? o.cor + ' translate-x-1' : 'text-tb-muted')}>›</span>
          </div>
        ))}
      </div>
      <BotaoLink onClick={onVoltar}>← Voltar para o login</BotaoLink>
    </div>
  );
}
