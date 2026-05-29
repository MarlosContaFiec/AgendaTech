import React from 'react';
import {FiAlertCircle,FiCheckCircle,FiInfo,FiAlertTriangle} from 'react-icons/fi';
var icons={error:FiAlertCircle,success:FiCheckCircle,info:FiInfo,warning:FiAlertTriangle};
var styles={error:'bg-[var(--error-muted)] border-[var(--error)] text-red-300',success:'bg-[var(--success-muted)] border-[var(--success)] text-emerald-300',info:'bg-[var(--accent-muted)] border-[var(--accent)] text-cyan-300',warning:'bg-[var(--warning-muted)] border-[var(--warning)] text-amber-300'};
export default function Alert({type='info',message}){
  if(!message)return null;
  var Icon=icons[type]||icons.info;
  return(<div className={'flex items-start gap-3 p-4 rounded-xl border '+(styles[type]||styles.info)}><Icon size={20} className="mt-0.5 flex-shrink-0"/><p className="text-sm">{message}</p></div>);
}