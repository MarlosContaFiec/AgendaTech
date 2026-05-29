import React from 'react';
export default function Badge({children,variant='default',className=''}){
  var v={default:'bg-[var(--bg-surface)] text-[var(--text-secondary)]',success:'bg-[var(--success-muted)] text-emerald-400',warning:'bg-[var(--warning-muted)] text-amber-400',error:'bg-[var(--error-muted)] text-red-400',info:'bg-[var(--accent-muted)] text-cyan-400'};
  return(<span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '+(v[variant]||v.default)+' '+className}>{children}</span>);
}