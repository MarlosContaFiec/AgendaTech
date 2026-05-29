import React from 'react';
export default function PasswordStrength({password}){
  if(!password)return null;
  var s=0;if(password.length>=6)s++;if(password.length>=8)s++;if(/[A-Z]/.test(password))s++;if(/[0-9]/.test(password))s++;if(/[^A-Za-z0-9]/.test(password))s++;
  var lv=['Muito fraca','Fraca','Razoavel','Boa','Forte'],cl=['#ef4444','#f59e0b','#f59e0b','#10b981','#10b981'];
  return(<div className="space-y-1"><div className="flex gap-1">{[1,2,3,4,5].map(function(i){return <div key={i} className="h-1 flex-1 rounded-full" style={{background:i<=s?cl[s-1]:'var(--border)'}}/>})}</div><p className="text-xs" style={{color:s>0?cl[s-1]:'var(--text-muted)'}}>{s>0?lv[s-1]:''}</p></div>);
}