import React from 'react';
import {FiX} from 'react-icons/fi';
export default function Modal({open,onClose,title,size='md',children}){
  if(!open)return null;
  var s={sm:'max-w-md',md:'max-w-lg',lg:'max-w-2xl',xl:'max-w-4xl'};
  return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/><div className={'relative w-full '+(s[size]||s.md)+' bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto'}><div className="flex items-center justify-between p-5 border-b border-[var(--border)]"><h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"><FiX size={20}/></button></div><div className="p-5">{children}</div></div></div>);
}