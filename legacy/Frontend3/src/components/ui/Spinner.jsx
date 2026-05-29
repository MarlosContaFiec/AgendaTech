import React from 'react';
export default function Spinner({size='md',className=''}){
  var s={sm:'w-4 h-4',md:'w-8 h-8',lg:'w-12 h-12'};
  return(<div className={'flex items-center justify-center '+className}><div className={(s[size]||s.md)+' border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin'}/></div>);
}