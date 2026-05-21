export default function StepIndicator({ etapas, atual }) {
  return (
    <div className="flex items-center gap-0 mb-[26px]">
      {etapas.map((e, i) => {
        const feito = i < atual;
        const ativo = i === atual;
        return (
          <div key={i} className={'flex items-center ' + (i < etapas.length - 1 ? 'flex-1' : '')}>
            <div className="flex flex-col items-center gap-1">
              <div className={
                'w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-extrabold flex-shrink-0 transition-all duration-300 ' +
                (feito ? 'bg-tb-green text-white' : ativo ? 'bg-gradient-to-br from-tb-accent to-violet-600 text-white shadow-[0_2px_12px_rgba(79,140,255,0.4)]' : 'bg-tb-surface3 border-[1.5px] border-tb-border2 text-tb-muted')
              }>
                {feito ? '✓' : i + 1}
              </div>
              <span className={'text-[0.58rem] uppercase tracking-[0.05em] whitespace-nowrap ' + (ativo ? 'text-tb-accent font-bold' : feito ? 'text-tb-green' : 'text-tb-muted')}>
                {e}
              </span>
            </div>
            {i < etapas.length - 1 && (
              <div className={'flex-1 h-[1.5px] mx-1.5 mb-3.5 transition-colors duration-400 ' + (feito ? 'bg-tb-green' : 'bg-tb-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
