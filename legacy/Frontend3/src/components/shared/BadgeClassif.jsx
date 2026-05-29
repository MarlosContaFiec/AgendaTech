import React from 'react';
export default function BadgeClassif({nicho,subNicho}){
  return(<div className="flex items-center gap-1.5 mt-1">{nicho&&<span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--accent-muted)] text-[var(--accent)]">{nicho}</span>}{subNicho&&<span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)]">{subNicho}</span>}</div>);
}