export default function StepIndicator({ etapas, atual }) {
  return (
    <div className="flex items-center mb-6">
      {etapas.map((e, i) => {
        const done = i < atual, active = i === atual;
        return (
          <div key={i} className={"flex items-center " + (i < etapas.length - 1 ? "flex-1" : "")}>
            <div className="flex flex-col items-center gap-1">
              <div className={"w-7 h-7 rounded-full flex items-center justify-center text-[0.72rem] font-black transition-all flex-shrink-0 " +
                (done ? "bg-success text-white" : active ? "bg-gradient-to-br from-purple to-neon text-white shadow-[0_0_12px_rgba(108,92,231,0.5)]" : "bg-surface-hover border border-line-light text-muted")}>
                {done ? "✓" : i + 1}
              </div>
              <span className={"text-[0.58rem] uppercase tracking-wider whitespace-nowrap " + (active ? "text-purple font-bold" : done ? "text-success" : "text-muted")}>{e}</span>
            </div>
            {i < etapas.length - 1 && <div className={"flex-1 h-[1.5px] mx-1.5 mb-3.5 transition-all " + (done ? "bg-success" : "bg-line")} />}
          </div>
        );
      })}
    </div>
  );
}
