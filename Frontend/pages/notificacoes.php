<?php 
session_start(); 
if(!isset($_SESSION['email'])){
    header('Location:../login.php');
    exit;
} 
$pageTitle='Notificações'; 
$currentPage='notificacoes'; 
include __DIR__.'/../includes/header.php'; 
include __DIR__.'/../includes/sidebar.php'; 
?>

<div class="sh"><div><h1>Notificações</h1><p id="n-sub"></p></div><button class="btn btn-g btn-s" onclick="markAll()">Marcar todas</button></div>
<div class="nl2" id="n-list"></div>

<script>
const N_EX=[{id:1,tipo:"solicitacao_aprovada",titulo:"Corte + Escova Premium",horario:"09:00",data:"2026-05-15",lida:false,time:new Date(Date.now()-3600000).toISOString()},{id:2,tipo:"lembrete",titulo:"Workshop Bem-Estar Mental",data:"2026-05-20",lida:false,time:new Date(Date.now()-7200000).toISOString()},{id:3,tipo:"fila_aguardando_aceite",titulo:"Noite Eletrônica",horario:"22:00",lida:true,time:new Date(Date.now()-86400000).toISOString()}];
const N_IC={solicitacao_aprovada:{ic:"✅",c:"#22d48a",bg:"rgba(34,212,138,.1)",l:"Aprovado"},solicitacao_recusada:{ic:"❌",c:"#ff5c7a",bg:"rgba(255,92,122,.1)",l:"Recusado"},lembrete:{ic:"🔔",c:"#4f8cff",bg:"rgba(79,140,255,.1)",l:"Lembrete"},fila_aguardando_aceite:{ic:"⏳",c:"#f5c842",bg:"rgba(245,200,66,.1)",l:"Vaga"},fila_entrada:{ic:"📋",c:"#8b9eff",bg:"rgba(91,108,255,.1)",l:"Na Fila"},evento_cancelado:{ic:"🚫",c:"#ffa94d",bg:"rgba(255,169,77,.1)",l:"Cancelado"}};
function nTxt(n){switch(n.tipo){case"solicitacao_aprovada":return'Sua solicitação para <strong>'+n.titulo+'</strong> foi <strong style="color:var(--ok)">aprovada</strong>!'+(n.horario?' Horário: '+n.horario:'');case"solicitacao_recusada":return'Sua solicitação para <strong>'+n.titulo+'</strong> foi <strong style="color:var(--err2)">recusada</strong>.';case"lembrete":return'Lembrete: <strong>'+n.titulo+'</strong> está chegando!'+(n.data?' 📅 '+formatDate(n.data):'');case"fila_aguardando_aceite":return'⏳ Vaga em <strong>'+n.titulo+'</strong>! Aceite antes que passe.';case"fila_entrada":return'📋 Você entrou na fila de <strong>'+n.titulo+'</strong>.';default:return n.titulo}}
function renderN(){const ns=getNotifs().length?getNotifs():N_EX;const nl=ns.filter(n=>!n.lida).length;document.getElementById('n-sub').textContent=nl>0?nl+' não lida(s)':'Tudo lido!';document.getElementById('n-list').innerHTML=ns.map(n=>{const i=N_IC[n.tipo]||N_IC.lembrete;const t=new Date(n.time).toLocaleString('pt-BR');return '<div class="ni2'+(n.lida?'':' unread')+'" style="'+(n.lida?'':'border-left-color:'+i.c)+'" onclick="markR('+n.id+')"><div class="ni-ico" style="background:'+i.bg+'">'+i.ic+'</div><div class="ni-cnt"><div class="ni-typ" style="color:'+i.c+'">'+i.l+(n.lida?'':'<span class="ni-dot"></span>')+'</div><div class="ni-txt">'+nTxt(n)+'</div><div class="ni-time">'+t+'</div></div></div>'}).join('')}
function markR(id){const ns=getNotifs().length?getNotifs():N_EX;const n=ns.find(x=>x.id===id);if(n){n.lida=true;saveNotifs(ns);renderN()}}
function markAll(){const ns=getNotifs().length?getNotifs():N_EX;ns.forEach(n=>n.lida=true);saveNotifs(ns);renderN();showToast('Todas marcadas.','ok')}
document.addEventListener('DOMContentLoaded',renderN);
</script>
<?php include __DIR__.'/../includes/footer.php'; ?>

