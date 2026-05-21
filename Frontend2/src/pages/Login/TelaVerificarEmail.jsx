import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiReenviarCodigo } from '@/services/auth';
import Logo from '@/components/shared/Logo';
import StepIndicator from '@/components/shared/StepIndicator';
import { Alerta } from '@/components/ui/Alert';
import { BotaoPrimario, BotaoLink } from '@/components/ui/Button';

export default function TelaVerificarEmail({ email, tipo, onVerificado, onTrocarEmail }) {
  const { verificarEmail } = useAuth();
  const [dig, setDig] = useState(['','','','','','']);
  const [load, setLoad] = useState(false);
  const [erro, setErro] = useState('');
  const [pod, setPod] = useState(false);
  const [cont, setCont] = useState(60);
  const [env, setEnv] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (cont <= 0) { setPod(true); return; }
    const t = setTimeout(() => setCont(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cont]);

  function digitar(i, v) {
    const d = v.replace(/\D/g, '').slice(-1);
    const n = [...dig]; n[i] = d;
    setDig(n); setErro('');
    if (d && i < 5) refs.current[i+1]?.focus();
    if (!d && i > 0) refs.current[i-1]?.focus();
  }

  function tecla(i, ev) {
    if (ev.key === 'Backspace' && !dig[i] && i > 0) refs.current[i-1]?.focus();
  }

  function colar(ev) {
    const t = ev.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (t.length === 6) { setDig(t.split('')); refs.current[5]?.focus(); }
  }

  async function verificar() {
    const cod = dig.join('');
    if (cod.length < 6) { setErro('Digite todos os 6 dígitos.'); return; }
    setLoad(true); setErro('');
    const res = await verificarEmail(email, cod, tipo);
    setLoad(false);
    if (res.success) onVerificado();
    else { setErro(res.message || 'Código incorreto.'); setDig(['','','','','','']); setTimeout(() => refs.current[0]?.focus(), 50); }
  }

  async function reenviar() {
    setEnv(true);
    await apiReenviarCodigo(email, tipo);
    setEnv(false); setPod(false); setCont(60); setErro('');
  }

  const ok = dig.every(d => d !== '');

  return (
    <div className="w-full max-w-[440px] bg-tb-surface border border-tb-border rounded-[20px] py-9 px-9 pb-8 shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_0_1px_rgba(79,140,255,0.06)] animate-fadeUp">
      <div className="mb-5"><Logo /></div>
      <StepIndicator etapas={['Dados','Verificação','Pronto']} atual={1} />
      <div className="text-center mb-[22px]">
        <div className="w-[66px] h-[66px] rounded-[18px] bg-tb-accent/18 border-[1.5px] border-tb-accent/35 inline-flex items-center justify-center text-[1.9rem] mb-4 animate-bounceIn">✉️</div>
        <h2 className="text-[1.2rem] font-black text-tb-text tracking-tight mb-2">Verifique seu e-mail</h2>
        <p className="text-[0.82rem] text-tb-muted2 leading-relaxed">Enviamos um código de 6 dígitos para<br/><strong className="text-tb-accent">{email}</strong></p>
      </div>
      <div className="flex gap-2 justify-center mb-5" onPaste={colar}>
        {dig.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d}
            onChange={ev => digitar(i, ev.target.value)} onKeyDown={ev => tecla(i, ev)}
            maxLength={2} inputMode="numeric" autoFocus={i === 0}
            className={'w-[46px] h-14 text-center rounded-xl text-[1.35rem] font-extrabold outline-none transition-all duration-200 text-tb-text ' + (d ? 'bg-tb-surface3 border-2 border-tb-accent ' : 'bg-tb-surface2 ') + (!d && erro ? 'border-2 border-tb-red ' : !d ? 'border-2 border-tb-border2 ' : '')} />
        ))}
      </div>
      {erro && <Alerta tipo="erro">{erro}</Alerta>}
      <div className={'flex flex-col gap-3 ' + (erro ? 'mt-3' : '')}>
        <BotaoPrimario loading={load} disabled={!ok} onClick={verificar}>Confirmar Código ✓</BotaoPrimario>
        <div className="text-center">
          {pod ? <BotaoLink onClick={reenviar} cor="#4f8cff">{env ? 'Reenviando...' : '📨 Reenviar código'}</BotaoLink>
            : <span className="text-[0.8rem] text-tb-muted">Reenviar em <strong className="text-tb-muted2">{cont}s</strong></span>}
        </div>
      </div>
      <div className="mt-[18px] py-3 px-3.5 bg-tb-amber/10 border border-tb-amber/20 rounded-[10px]">
        <p className="text-[0.76rem] text-tb-amber leading-relaxed m-0">💡 Verifique também a pasta de <strong>spam</strong>. O código expira em <strong>10 minutos</strong>.</p>
      </div>
      <div className="mt-4"><BotaoLink onClick={onTrocarEmail}>← Usar outro e-mail</BotaoLink></div>
    </div>
  );
}
