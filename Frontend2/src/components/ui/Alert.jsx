const MAP = {
  erro:    { bg: 'bg-tb-red/10',    border: 'border-tb-red/25',    text: 'text-tb-red',    icon: '✕' },
  sucesso: { bg: 'bg-tb-green/10',  border: 'border-tb-green/25',  text: 'text-tb-green',  icon: '✓' },
  info:    { bg: 'bg-tb-accent/10', border: 'border-tb-accent/25', text: 'text-tb-accent', icon: 'i' },
  aviso:   { bg: 'bg-tb-amber/10',  border: 'border-tb-amber/25',  text: 'text-tb-amber',  icon: '!' },
};

export function Alerta({ tipo = 'erro', children }) {
  const c = MAP[tipo];
  return (
    <div className={c.bg + ' border ' + c.border + ' rounded-[10px] py-[11px] px-3.5 flex gap-2.5 items-start animate-fadeUp'}>
      <span className={c.text + ' font-black text-[0.9rem] flex-shrink-0 mt-[1px]'}>{c.icon}</span>
      <p className={'text-[0.81rem] ' + c.text + ' leading-relaxed m-0'}>{children}</p>
    </div>
  );
}

export function ErroLabel({ texto }) {
  if (!texto) return null;
  return (
    <div className="flex items-center gap-1 mt-[5px] text-[0.72rem] text-tb-red">
      <span>!</span>{texto}
    </div>
  );
}
