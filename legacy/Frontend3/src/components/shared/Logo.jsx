import React from 'react';
export default function Logo({size='md'}){
  var s={sm:'text-xl',md:'text-2xl',lg:'text-4xl'};
  return(<h1 className={'font-bold tracking-tight '+(s[size]||s.md)} style={{fontFamily:'Syne, sans-serif'}}><span className="text-[var(--accent)]">Agenda</span><span className="text-[var(--text-primary)]">Tech</span></h1>);
}