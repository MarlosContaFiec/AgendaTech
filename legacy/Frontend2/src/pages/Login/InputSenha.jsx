import { useState } from 'react';
import { Label } from '@/components/ui/Input';
import { ErroLabel } from '@/components/ui/Alert';

export function InputSenha({ label, erro, placeholder, value, onChange, obrigatorio }) {
  const [ver, setVer] = useState(false);
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <div className="relative">
        <span className={'absolute left-3 top-[57%] -translate-y-1/2 text-base pointer-events-none transition-colors duration-200 ' + (foco ? 'text-tb-accent' : 'text-tb-muted')}><span className='material-icons-outlined'>lock</span></span>
        <input type={ver ? 'text' : 'password'} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFoco(true)} onBlur={() => setFoco(false)}
          className={'w-full box-border rounded-[10px] text-[0.88rem] outline-none transition-all duration-200 py-3 pl-10 pr-11 text-tb-text ' + (foco ? 'bg-tb-surface3 ' : 'bg-tb-surface2 ') + (erro ? 'border-[1.5px] border-tb-red ' : foco ? 'border-[1.5px] border-tb-accent ' : 'border-[1.5px] border-tb-border2 ')} />
        <button type="button" onClick={() => setVer(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-tb-muted text-base p-1 leading-none">
          {ver ? <span class='material-icons-outlined'>visibility_off</span> : <span class='material-icons-outlined'>visibility_off</span>}
        </button>
      </div>
      <ErroLabel texto={erro} />
    </div>
  );
}
export default InputSenha;
