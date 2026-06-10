<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
} 
  $pageTitle='Calendário'; 
  $currentPage='calendario'; 
  include __DIR__.'/../includes/header.php'; 
  include __DIR__.'/../includes/sidebar.php'; ?>

<div class="sh"><div><h1>Meu Calendário</h1><p>Seus agendamentos</p></div></div>

<div style="display:grid;grid-template-columns:340px 1fr;gap:20px;align-items:start" id="cal-wrap">
  <div class="cal-box" id="cal-box"></div>
  <div id="cal-det"><div class="card" style="padding:40px;text-align:center"><div style="font-size:36px;margin-bottom:12px">📅</div><h3 style="font-weight:600;margin-bottom:4px">Selecione um dia</h3><p style="font-size:.875rem;color:var(--t3)">Clique em um dia com eventos.</p></div></div>
</div>

<script>
let cY=<?=date('Y')?>,cM=<?=date('n')-1?>,cD=null;

function renderCal(){
  const regs=getRegs(),ins=EVENTOS.filter(e=>regs[e.id]?.inscrito||regs[e.id]?.pendente);
  const pd={};ins.forEach(e=>{if(!pd[e.data])pd[e.data]=[];pd[e.data].push(e)});
  const first=new Date(cY,cM,1).getDay(),days=new Date(cY,cM+1,0).getDate(),today=new Date();
  let h='<div class="cal-nav"><button onclick="cNav(-1)">‹</button><span class="ml">'+MESES[cM]+' '+cY+'</span><button onclick="cNav(1)">›</button></div>';
  h+='<div class="cal-hdr">'+DIAS.map(d=>'<span>'+d+'</span>').join('')+'</div><div class="cal-grd">';
  for(let i=0;i<first;i++)h+='<div></div>';
  for(let d=1;d<=days;d++){
    const ds=cY+'-'+String(cM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const has=!!pd[ds],isT=d===today.getDate()&&cM===today.getMonth()&&cY===today.getFullYear(),isS=d===cD;
    let cls='cd';if(isT)cls+=' today';if(isS)cls+=' sel';if(has)cls+=' hev';
    const dots=has?'<div class="dots">'+pd[ds].slice(0,3).map(()=>'<div class="dt2"></div>').join('')+'</div>':'';
    h+='<div class="'+cls+'" onclick="cSel('+d+')"><span class="dn">'+d+'</span>'+dots+'</div>';
  }
  h+='</div><ul class="cal-lg"><li><div class="ld"></div> Hoje</li><li><div class="le"></div> Evento</li></ul>';
  document.getElementById('cal-box').innerHTML=h;

  const el=document.getElementById('cal-det');
  if(!cD){el.innerHTML='<div class="card" style="padding:40px;text-align:center"><div style="font-size:36px;margin-bottom:12px">📅</div><h3 style="font-weight:600;margin-bottom:4px">Selecione um dia</h3><p style="font-size:.875rem;color:var(--t3)">Clique em um dia com eventos.</p></div>';return;}
  const ds2=cY+'-'+String(cM+1).padStart(2,'0')+'-'+String(cD).padStart(2,'0');
  const evts=pd[ds2]||[];
  if(!evts.length){el.innerHTML='<div class="card" style="padding:20px;text-align:center"><p style="color:var(--t3)">Nenhum evento neste dia.</p></div>';return;}
  el.innerHTML=evts.map(ev=>{const r=regs[ev.id]||{};return '<div class="card" style="padding:16px 20px;border-left:3px solid #5b6cff;margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px"><p style="font-weight:700">'+ev.titulo+'</p>'+(r.pendente?'<span class="bdg bdg-w">⏳ Pendente</span>':'')+'</div><p style="font-size:.78rem;color:var(--t3);margin-bottom:8px">'+ev.estab+'</p><span style="font-size:.78rem;background:rgba(91,108,255,.12);color:var(--acl);padding:3px 10px;border-radius:6px">🕐 '+(r.horario||ev.horarios[0])+'</span></div>'}).join('');
}
function cNav(dir){cM+=dir;if(cM<0){cM=11;cY--}if(cM>11){cM=0;cY++}cD=null;renderCal()}
function cSel(d){cD=cD===d?null:d;renderCal()}
document.addEventListener('DOMContentLoaded',renderCal);
</script>
<?php include __DIR__.'/../includes/footer.php'; ?>

