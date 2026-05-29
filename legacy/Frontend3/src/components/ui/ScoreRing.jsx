import React from 'react';
import {scoreColor} from '../../utils/calculators';
export default function ScoreRing({score,size=80}){
  var r=(size-8)/2,c=2*Math.PI*r,off=c-(score/100)*c,col=scoreColor(score);
  return(<div className="relative inline-flex items-center justify-center" style={{width:size,height:size}}><svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={r} stroke="var(--border)" strokeWidth="4" fill="none"/><circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth="4" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" className="transition-all duration-700"/></svg><span className="absolute text-sm font-bold" style={{color:col}}>{Math.round(score)}</span></div>);
}