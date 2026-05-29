import Spinner from './Spinner';

export function BotaoPrimario({ children, loading, disabled, onClick }) {
  const off = loading || disabled;
  return (
    <button onClick={onClick} disabled={off}
      className={
        'w-full py-3 px-4 rounded-xl border-none bg-gradient-to-br from-tb-accent to-violet-600 text-white font-extrabold text-[0.91rem] tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(79,140,255,0.3)] transition-all duration-200 ' +
        (off ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0_6px_28px_rgba(79,140,255,0.45)]')
      }>
      {loading ? <><Spinner /> Aguarde...</> : children}
    </button>
  );
}

export function BotaoGhost({ children, onClick }) {
  return (
    <button onClick={onClick}
      className="w-full py-[11px] px-4 rounded-xl border-[1.5px] border-tb-border2 bg-none text-tb-muted2 font-semibold text-[0.85rem] cursor-pointer transition-all duration-200 hover:border-tb-muted hover:text-tb-text">
      {children}
    </button>
  );
}

export function BotaoLink({ children, onClick, cor }) {
  return (
    <button onClick={onClick} style={cor ? { color: cor } : undefined}
      className={'bg-none border-none cursor-pointer text-[0.82rem] inline-flex items-center gap-1 p-0 font-medium hover:underline ' + (!cor ? 'text-tb-muted' : '')}>
      {children}
    </button>
  );
}
