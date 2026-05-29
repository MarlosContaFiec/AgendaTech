import { useState, useEffect } from 'react';
import Logo from '@/components/shared/Logo';
import StepIndicator from '@/components/shared/StepIndicator';
import { BotaoPrimario } from '@/components/ui/Button';

export default function TelaSucesso({ tipo, onIrLogin }) {
  const [seg, setSeg] = useState(5);
  useEffect(() => {
    if (seg <= 0) { onIrLogin(); return; }
    const t = setTimeout(() => setSeg(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seg, onIrLogin]);

  return (
    <div className="w-full max-w-[440px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={['Dados','Verificação','Pronto']} atual={2} />
      <div className="text-center py-2 pb-5">
        <div className="w-[72px] h-[72px] rounded-full bg-tb-green/10 border-2 border-tb-green inline-flex items-center justify-center mb-5 animate-bounceIn">
          <span className="text-[2rem] text-tb-green">✓</span>
        </div>
        <h2 className="text-[1.3rem] font-black text-tb-green tracking-tight mb-2">Conta criada com sucesso!</h2>
        <p className="text-[0.84rem] text-tb-muted2 leading-relaxed mb-[22px]">
          Seu e-mail foi verificado. {tipo === 'empresa' ? 'Acesse o painel e gerencie seus serviços.' : 'Faça login e comece a agendar.'}
        </p>
        <div className="inline-flex items-center gap-2.5 bg-tb-surface2 border border-tb-border2 rounded-xl py-3 px-[18px] mb-6">
          <span className="text-[1.3rem]">{tipo === 'empresa' ? '🏢' : '👤'}</span>
          <div className="text-left">
            <div className="text-[0.68rem] text-tb-muted uppercase tracking-[0.07em] mb-0.5">Tipo de acesso</div>
            <div className="text-[0.88rem] font-bold text-tb-text">{tipo === 'empresa' ? 'Empresa — Painel TrustBook' : 'Cliente — Área do Cliente'}</div>
          </div>
        </div>
        <BotaoPrimario onClick={onIrLogin}>Ir para o Login →</BotaoPrimario>
        <p className="text-[0.75rem] text-tb-muted mt-3.5">Redirecionando em <strong className="text-tb-muted2">{seg}s</strong></p>
      </div>
    </div>
  );
}
