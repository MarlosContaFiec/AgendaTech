import { useState } from 'react';
import { Label } from './Input';
import { ErroLabel } from './Alert';

export function Select({ label, erro, obrigatorio, children, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <select {...props}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
        className={
          'w-full box-border rounded-[10px] text-[0.88rem] outline-none transition-all duration-200 cursor-pointer py-[11px] px-3.5 text-tb-text ' +
          (foco ? 'bg-tb-surface3 ' : 'bg-tb-surface2 ') +
          (erro ? 'border-[1.5px] border-tb-red ' : foco ? 'border-[1.5px] border-tb-accent ' : 'border-[1.5px] border-tb-border2 ')
        }>
        {children}
      </select>
      <ErroLabel texto={erro} />
    </div>
  );
}
