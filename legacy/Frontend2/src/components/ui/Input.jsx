import { useState } from 'react';
import { ErroLabel } from './Alert';

export function Label({ texto, erro, obrigatorio }) {
  if (!texto) return null;
  return (
    <div className={'text-[0.7rem] font-bold uppercase tracking-[0.07em] mb-[5px] ' + (erro ? 'text-tb-red' : 'text-tb-muted')}>
      {texto}{obrigatorio && <span className="text-tb-accent ml-0.5">*</span>}
    </div>
  );
}

export function Input({ label, erro, icone, sufixo, obrigatorio, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <div className="relative">
        {icone && (
          <span className={'absolute left-3 top-[55%] -translate-y-1/2 text-base pointer-events-none transition-colors duration-200 ' + (foco ? 'text-tb-accent' : 'text-tb-muted')}>
            {icone}
          </span>
        )}
        <input
          {...props}
          onFocus={e => { setFoco(true); props.onFocus && props.onFocus(e); }}
          onBlur={e => { setFoco(false); props.onBlur && props.onBlur(e); }}
          className={
            'w-full box-border rounded-[10px] text-[0.88rem] outline-none transition-all duration-200 text-tb-text ' +
            (foco ? 'bg-tb-surface3 ' : 'bg-tb-surface2 ') +
            (erro ? 'border-[1.5px] border-tb-red ' : foco ? 'border-[1.5px] border-tb-accent ' : 'border-[1.5px] border-tb-border2 ') +
            (icone ? 'py-3 pl-10 pr-3.5 ' : 'py-3 px-3.5 ') +
            (sufixo ? '!pr-11 ' : '')
          }
        />
        {sufixo && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-tb-muted text-[0.9rem]">
            {sufixo}
          </span>
        )}
      </div>
      <ErroLabel texto={erro} />
    </div>
  );
}
