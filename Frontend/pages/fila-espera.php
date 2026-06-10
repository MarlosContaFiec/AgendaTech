<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
  } 
  $pageTitle='Fila de Espera'; 
  $currentPage='fila-espera'; 
  include'../includes/header.php'; 
  include'../includes/sidebar.php'; 
?>

<div class="sh"><div><h1>Fila de Espera</h1><p id="fila-sub"></p></div></div>
<div id="fila-list"></div>

<script>
function renderFila(){
  const nf=EVENTOS.filter(e=>(e.fila||[]).some(f=>f.cid===CLIENT_ID));
  document.getElementById('fila-sub').textContent=nf.length+' ativa(s)';
  const el=document.getElementById('fila-list');
  if(!nf.length){el.innerHTML='<div class="empty"><div class="ei">⏳</div><h3>Nenhuma fila ativa.</h3><p>Quando lotado, entre na fila pelo Explorar.</p><a href="explorar.php" class="btn btn-p" style="margin-top:8px">Explorar</a></div>';return;}
  el.innerHTML=nf.map(ev=>{const fe=ev.fila.find(f=>f.cid===CLIENT_ID);const pos=ev.fila.indexOf(fe)+1;const lim=ev.limFila||3;return '<div class="fc2"><div class="ftop" style="flex:1"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><p style="font-weight:700">'+ev.titulo+'</p><span class="bdg bdg-a">⏳ #'+pos+'</span></div><p style="font-size:.78rem;color:var(--t3)">'+ev.estab+'</p><p style="font-size:.78rem;color:var(--t3);margin-top:4px">🕐 '+fe.horario+' · '+formatDate(ev.data)+'</p></div><div class="fstats"><div class="fstat"><div class="sl">Posição</div><div class="sn" style="color:var(--acl)"> #'+pos+'</div></div><div class="fstat"><div class="sl">Fila</div><div class="sn">'+ev.fila.length+'/'+lim+'</div></div><button class="btn btn-d btn-s" onclick="sairFilaPage('+ev.id+')">Sair</button></div></div><div class="fbar"><div class="fbar-f" style="width:'+(ev.fila.length/lim*100)+'%"></div></div></div>'}).join('');
}
function sairFilaPage(id){const ev=EVENTOS.find(e=>e.id===id);if(ev)ev.fila=(ev.fila||[]).filter(f=>f.cid!==CLIENT_ID);showToast('Saiu da fila.','i');renderFila()}
document.addEventListener('DOMContentLoaded',renderFila);
</script>
<?php include __DIR__.'/../includes/footer.php'; ?>

