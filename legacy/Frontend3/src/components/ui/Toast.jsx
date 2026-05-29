import React,{useEffect} from 'react';
import {FiX,FiCheckCircle,FiAlertCircle} from 'react-icons/fi';
export default function Toast({message,type='success',visible,onClose}){
  useEffect(function(){if(visible){var t=setTimeout(onClose,4000);return function(){clearTimeout(t);};}},[visible,onClose]);
  if(!visible)return null;
  return(<div className="fixed top-4 right-4 z-[100]" style={{animation:'slideIn .3s ease'}}><div className={'flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border '+(type==='success'?'bg-emerald-900/90 border-emerald-700 text-emerald-200':'bg-red-900/90 border-red-700 text-red-200')}>{type==='success'?<FiCheckCircle size={18}/>:<FiAlertCircle size={18}/>}<p className="text-sm font-medium">{message}</p><button onClick={onClose} className="ml-2 p-0.5 rounded hover:bg-white/10"><FiX size={16}/></button></div></div>);
}