import React from 'react';
var WD=['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
export default function CalendarGrid({year,month,data,onDayClick,selectedDate}){
  data=data||{};
  var first=new Date(year,month-1,1).getDay(),total=new Date(year,month,0).getDate(),days=[];
  for(var i=0;i<first;i++)days.push(null);for(var d=1;d<=total;d++)days.push(d);
  function pad(n){return n<10?'0'+n:''+n;}
  return(<div><div className="grid grid-cols-7 gap-1 mb-2">{WD.map(function(d){return <div key={d} className="text-center text-xs font-medium text-[var(--text-muted)] py-2">{d}</div>})}</div><div className="grid grid-cols-7 gap-1">{days.map(function(day,i){
    if(!day)return <div key={'e'+i}/>;
    var ds=year+'-'+pad(month)+'-'+pad(day),info=data[ds],open=info?info.aberto!==false:true,sel=selectedDate===ds;
    var now=new Date(),today=now.getFullYear()===year&&now.getMonth()+1===month&&now.getDate()===day;
    return(<button key={day} onClick={function(){onDayClick&&onDayClick(ds);}} className={'relative p-2 rounded-lg text-sm transition-all '+(sel?'bg-[var(--accent)] text-white font-bold':today?'bg-[var(--accent-muted)] text-[var(--accent)] font-medium':open?'hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]':'text-[var(--text-muted)] line-through opacity-50')}>{day}{info&&info.tags&&info.tags.length>0&&<div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">{info.tags.slice(0,2).map(function(t,ti){return <span key={ti} className="w-1 h-1 rounded-full" style={{background:t.cor||'#888'}}/>})}</div>}</button>);
  })}</div></div>);
}