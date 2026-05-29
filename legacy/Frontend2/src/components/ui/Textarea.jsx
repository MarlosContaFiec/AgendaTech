import { useState } from 'react';
import { Label } from './Input';
import { ErroLabel } from './Alert';

export function Textarea({ label, erro, obrigatorio, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <textarea {...props}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
        className={
          'w-full box-border rounded-[10px] text-[0.88rem] outline-none transition-all duration-200 py-3 px-3.5 resize-y text-tb-text ' +
          (foco ? 'bg-tb-surface3 ' : 'bg-tb-surface2 ') +
          (erro ? 'border-[1.5px] border-tb-red ' : foco ? 'border-[1.5px] border-tb-accent ' : 'border-[1.5px] border-tb-border2 ')
        }
      />
      <ErroLabel texto={erro} />
    </div>
  );
}
