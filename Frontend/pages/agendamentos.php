<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
  } 
  $pageTitle='Explorar'; 
  $currentPage='explorar'; 
  include __DIR__.'/../includes/header.php'; 
  include __DIR__.'/../includes/sidebar.php'; ?>

<div class="sh"><div><h1>Meus Agendamentos</h1></div></div>
<div class="tabs" id="tabs"><button class="tab act" onclick="sTab('prox',this)">Próximos (0)</button><button class="tab" onclick="sTab('pend',this)">Pendentes (0)</button><button class="tab" onclick="sTab('hist',this)">Histórico (0)</button></div>
<div class="al" id="ag-list"></div>

<script>
let curTab='prox';
function renderAg(){
  const regs=getRegs(),now=new Date().toISOString().split('T')[0];
  const ins=EVENTOS.filter(e=>regs[e.id]?.inscrito).sort((a,b)=>a.data.localeCompare(b.data));
  const pen=EVENTOS.filter(e=>regs[e.id]?.pendente);
  const prox=ins.filter(e=>e.data>=now),hist=ins.filter(e=>e.data<now);
  const items=curTab==='prox'?prox:curTab==='pend'?pen:hist;
  const el=document.getElementById('ag-list');
  document.querySelectorAll('.tab')[0].textContent='Próximos ('+prox.length+')';
  document.querySelectorAll('.tab')[1].textContent='Pendentes ('+pen.length+')';
  document.querySelectorAll('.tab')[2].textContent='Histórico ('+hist.length+')';
  if(!items.length){el.innerHTML='<div class="empty"><div class="ei">📋</div><h3>Nenhum agendamento.</h3><p>Inscreva-se em serviços.</p><a href="explorar.php" class="btn btn-p" style="margin-top:8px">Explorar</a></div>';return;}
  el.innerHTML=items.map(ev=>{const r=regs[ev.id]||{};const mo=MESES[parseInt(ev.data.split('-')[1])-1].slice(0,3).toUpperCase();const dy=ev.data.split('-')[2];return '<div class="ai"><div class="adb"><div class="mo2">'+mo+'</div><div class="dy">'+dy+'</div></div><div class="ai-inf"><div class="at">'+ev.titulo+'</div><div class="as">'+ev.estab+' · '+ev.cidade+'</div><div class="as" style="margin-top:4px">🕐 '+(r.horario||ev.horarios[0])+' · '+formatDate(ev.data)+'</div></div><div class="ai-act"><button class="btn btn-d btn-s" onclick="cancelAg('+ev.id+')">Cancelar</button></div></div>'}).join('');
}
function sTab(t,btn){curTab=t;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('act'));btn.classList.add('act');renderAg()}
function cancelAg(id){const regs=getRegs();delete regs[id];saveRegs(regs);showToast('Cancelado.','i');renderAg()}
document.addEventListener('DOMContentLoaded',renderAg);
</script>
<?php include __DIR__.'/../includes/footer.php'; ?>

