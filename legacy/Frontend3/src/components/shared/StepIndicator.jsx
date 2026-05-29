import React from 'react';
export default function StepIndicator({steps,current}){
  return(<div className="flex items-center gap-2">{steps.map(function(step,i){
    return(<React.Fragment key={i}><div className={'flex items-center gap-2 '+(i<=current?'text-[var(--accent)]':'text-[var(--text-muted)]')}><div className={'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold '+(i<current?'bg-[var(--accent)] text-white':i===current?'bg-[var(--accent-muted)] border-2 border-[var(--accent)]':'bg-[var(--bg-surface)] border border-[var(--border)]')}>{i<current?'\u2713':i+1}</div><span className="text-sm font-medium hidden sm:block">{step}</span></div>{i<steps.length-1&&<div className={'flex-1 h-px '+(i<current?'bg-[var(--accent)]':'bg-[var(--border)]')}/>}</React.Fragment>);
  })}</div>);
}