<<<<<<< HEAD
<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
} 
  $pageTitle='Meu Perfil'; 
  $currentPage='perfil'; 
  include __DIR__.'/../includes/header.php'; 
  include __DIR__.'/../includes/sidebar.php'; 
?>

<div class="sh"><div><h1>Meu Perfil</h1><p>Gerencie suas informações</p></div></div>
<div class="card pf" style="padding:32px">
  <div class="pgrid">
    <div class="fg"><label>NOME</label><input type="text" class="fi" id="p-nome" placeholder="Seu nome"></div>
    <div class="fg"><label>CPF</label><input type="text" class="fi" id="p-cpf" placeholder="000.000.000-00" maxlength="14" oninput="this.value=maskCPF(this.value)"></div>
    <div class="fg"><label>NASCIMENTO</label><input type="date" class="fi" id="p-nasc" onchange="updIdade()"></div>
    <div class="fg"><label>IDADE</label><input type="text" class="fi" id="p-idade" readonly style="background:#222636;color:#7c819a"></div>
    <div class="fg"><label>TELEFONE</label><input type="text" class="fi" id="p-tel" placeholder="(00) 00000-0000" maxlength="15" oninput="this.value=maskPhone(this.value)"></div>
    <div class="fg"><label>ESTADO</label><select class="fs" id="p-estado" onchange="updCidPerfil()"><option value="">Selecione</option><option>SP</option><option>RJ</option><option>MG</option></select></div>
    <div class="fg"><label>CIDADE</label><select class="fs" id="p-cidade"><option value="">Selecione</option></select></div>
  </div>
  <button class="btn btn-p" onclick="salvarPerf()">Salvar</button>
</div>

<script>
function updCidPerfil(){const e=document.getElementById('p-estado').value,s=document.getElementById('p-cidade');s.innerHTML='<option value="">Selecione</option>'+(CIDADES[e]||[]).map(c=>'<option>'+c+'</option>').join('')}
function updIdade(){const n=document.getElementById('p-nasc').value;document.getElementById('p-idade').value=n?calcIdade(n)+' anos':'—'}
function loadPerf(){const p=getPerfil();document.getElementById('p-nome').value=p.nome||'';document.getElementById('p-cpf').value=p.cpf||'';document.getElementById('p-nasc').value=p.nascimento||'';document.getElementById('p-tel').value=p.telefone||'';document.getElementById('p-estado').value=p.estado||'';updCidPerfil();document.getElementById('p-cidade').value=p.cidade||'';updIdade()}
function salvarPerf(){const p={nome:document.getElementById('p-nome').value,cpf:document.getElementById('p-cpf').value,nascimento:document.getElementById('p-nasc').value,telefone:document.getElementById('p-tel').value,estado:document.getElementById('p-estado').value,cidade:document.getElementById('p-cidade').value};savePerfil(p);updIdade();showToast('Perfil salvo!','ok')}
document.addEventListener('DOMContentLoaded',loadPerf);
</script>
<?php include __DIR__.'/../includes/footer.php'; ?>

=======
<?php
session_start();
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
}
$pageTitle='Meu Perfil';
$currentPage='perfil';
include __DIR__.'/../includes/header.php';
include __DIR__.'/../includes/sidebar.php';
?>

<div class="sh">
  <div>
    <h1>Meu Perfil</h1>
    <p>Gerencie suas informações</p>
  </div>
</div>

<!-- TOPO DO PERFIL -->
<div class="card" style="padding:24px;margin-bottom:20px">
  <div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap">
    <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#5b6cff,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff;flex-shrink:0" id="avatar-big">U</div>
    <div style="flex:1;min-width:200px">
      <h2 id="perfil-nome" style="margin-bottom:4px">Carregando...</h2>
      <p id="perfil-email" style="color:var(--t3);font-size:.875rem;margin-bottom:4px"></p>
      <p id="perfil-tipo" style="color:var(--t3);font-size:.78rem"></p>
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <span class="bdg bdg-ok" id="badge-score">⭐ 100 pontos</span>
        <span class="bdg bdg-a" id="badge-idade">🎂 Idade: --</span>
        <span class="bdg" id="badge-clf" style="background:rgba(91,108,255,.1);color:#8b9cff">🔞 Classificação: --</span>
      </div>
    </div>
    <div style="text-align:center;flex-shrink:0">
      <svg width="140" height="85" viewBox="0 0 200 120">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--bg4)" stroke-width="12" stroke-linecap="round"/>
        <path id="score-arc" d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" stroke-width="12" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="0"/>
        <text x="100" y="88" text-anchor="middle" fill="var(--t1)" font-size="32" font-weight="bold" id="score-num">100</text>
      </svg>
      <p style="font-size:.75rem;color:#22c55e;font-weight:700" id="score-label">Excelente reputação</p>
    </div>
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">

  <!-- SCORE / PONTUAÇÃO -->
  <div class="card" style="padding:20px">
    <h3 style="margin-bottom:16px;font-size:1rem">⭐ Sistema de Pontuação</h3>
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;margin-bottom:8px">
        <span style="font-size:.85rem;color:var(--t2)">📅 Agendamentos realizados</span>
        <span class="sc-ag" style="font-weight:700;color:var(--ok)">+0</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;margin-bottom:8px">
        <span style="font-size:.85rem;color:var(--t2)">✅ Presenças confirmadas</span>
        <span class="sc-pr" style="font-weight:700;color:var(--ok)">+0</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;margin-bottom:8px">
        <span style="font-size:.85rem;color:var(--t2)">⭐ Avaliações feitas</span>
        <span class="sc-av" style="font-weight:700;color:var(--ok)">+0</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;margin-bottom:8px">
        <span style="font-size:.85rem;color:var(--t2)">⏰ Cancelamentos em cima da hora</span>
        <span class="sc-ca" style="font-weight:700;color:var(--err)">-0</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--bg3);border:1px solid var(--brd);border-radius:8px;margin-bottom:8px">
        <span style="font-size:.85rem;color:var(--t2)">🚶 No-shows (faltas)</span>
        <span class="sc-ns" style="font-weight:700;color:var(--err)">-0</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(91,108,255,.08);border:1px solid rgba(91,108,255,.2);border-radius:8px;margin-top:12px">
        <span style="font-size:.9rem;font-weight:700;color:var(--t1)">TOTAL</span>
        <span id="score-total" style="font-size:1.1rem;font-weight:800;color:#5b6cff">100 pontos</span>
      </div>
    </div>
  </div>

  <!-- CLASSIFICAÇÃO ETÁRIA -->
  <div class="card" style="padding:20px">
    <h3 style="margin-bottom:16px;font-size:1rem">🔞 Classificação Etária</h3>
    <div id="idade-resumo" style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:14px 16px;margin-bottom:16px;text-align:center">
      <div style="font-size:2rem;font-weight:800;color:var(--t1)" id="idade-num">--</div>
      <div style="font-size:.78rem;color:var(--t3)">anos</div>
    </div>
    <p id="idade-msg" style="font-size:.78rem;color:var(--t3);margin-bottom:12px;line-height:1.5;text-align:center"></p>
    <div id="clf-list" style="display:flex;flex-direction:column;gap:4px"></div>
  </div>

</div>

<!-- INFORMAÇÕES PESSOAIS -->
<div class="card" style="padding:20px;margin-bottom:20px">
  <h3 style="margin-bottom:16px;font-size:1rem">📋 Informações Pessoais</h3>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">Nome</label>
      <input type="text" id="inp-nome" class="fi" placeholder="Seu nome" style="width:100%">
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">E-mail</label>
      <input type="email" id="inp-email" class="fi" placeholder="seu@email.com" style="width:100%" disabled>
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">CPF</label>
      <input type="text" id="inp-cpf" class="fi" placeholder="000.000.000-00" style="width:100%">
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">Telefone</label>
      <input type="text" id="inp-tel" class="fi" placeholder="(00) 00000-0000" style="width:100%">
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">Data de Nascimento</label>
      <input type="date" id="inp-nasc" class="fi" style="width:100%">
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">Estado</label>
      <select id="inp-estado" class="fi" style="width:100%">
        <option value="">Selecione</option>
        <option>SP</option><option>RJ</option><option>MG</option><option>BA</option><option>RS</option>
        <option>PR</option><option>SC</option><option>CE</option><option>PE</option><option>GO</option>
      </select>
    </div>
    <div>
      <label style="font-size:.78rem;color:var(--t3);display:block;margin-bottom:6px">Cidade</label>
      <input type="text" id="inp-cidade" class="fi" placeholder="Sua cidade" style="width:100%">
    </div>
  </div>
  <div style="margin-top:16px;display:flex;justify-content:flex-end">
    <button class="btn btn-p" onclick="salvarPerfil()">💾 Salvar Alterações</button>
  </div>
</div>

<!-- HISTÓRICO -->
<div class="card" style="padding:20px;margin-bottom:20px">
  <h3 style="margin-bottom:16px;font-size:1rem">📊 Resumo de Atividades</h3>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
    <div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--t1)" id="stat-agend">0</div>
      <div style="font-size:.72rem;color:var(--t3);margin-top:2px">Agendamentos</div>
    </div>
    <div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--ok)" id="stat-presenca">0</div>
      <div style="font-size:.72rem;color:var(--t3);margin-top:2px">Presenças</div>
    </div>
    <div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:var(--err)" id="stat-cancel">0</div>
      <div style="font-size:.72rem;color:var(--t3);margin-top:2px">Cancelamentos</div>
    </div>
    <div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:16px;text-align:center">
      <div style="font-size:1.8rem;font-weight:800;color:#5b6cff" id="stat-avaliac">0</div>
      <div style="font-size:.72rem;color:var(--t3);margin-top:2px">Avaliações</div>
    </div>
  </div>
</div>

<script>
(function(){
  // ─── CLASSIFICAÇÕES ──────────────────────────────────────
  const CLASSIF=[
    {val:'livre',label:'Livre',  icon:'🟢',cor:'#22c55e'},
    {val:'10',   label:'+10',    icon:'🔵',cor:'#4f8cff'},
    {val:'12',   label:'+12',    icon:'🟡',cor:'#f5c842'},
    {val:'14',   label:'+14',    icon:'🟠',cor:'#ffa94d'},
    {val:'16',   label:'+16',    icon:'🔴',cor:'#ff5c7a'},
    {val:'18',   label:'+18',    icon:'🔞',cor:'#c084fc'}
  ];

  const PERFIL_KEY='trustbook_perfil';
  const SCORE_KEY='trustbook_score';

  function getPerfil(){
    try{const d=localStorage.getItem(PERFIL_KEY);return d?JSON.parse(d):{}}catch{return{}}
  }
  function savePerfil(d){try{localStorage.setItem(PERFIL_KEY,JSON.stringify(d))}catch{}}

  function getScore(){
    try{
      const d=localStorage.getItem(SCORE_KEY);
      if(d) return JSON.parse(d);
      return {base:100,agend:0,presenca:0,avaliac:0,cancel:0,noshow:0};
    }catch{return{base:100,agend:0,presenca:0,avaliac:0,cancel:0,noshow:0}}
  }
  function saveScore(d){try{localStorage.setItem(SCORE_KEY,JSON.stringify(d))}catch{}}

  function calcIdade(nasc){
    if(!nasc)return null;
    const hoje=new Date();
    const n=new Date(nasc);
    let idade=hoje.getFullYear()-n.getFullYear();
    const m=hoje.getMonth()-n.getMonth();
    if(m<0||(m===0&&hoje.getDate()<n.getDate()))idade--;
    return idade;
  }

  function render(){
    const perfil=getPerfil();
    const score=getScore();

    const nome=perfil.nome||'Usuário';
    const email='<?= htmlspecialchars($_SESSION['email']) ?>';
    const inicial=nome.charAt(0).toUpperCase();
    document.getElementById('avatar-big').textContent=inicial;
    document.getElementById('perfil-nome').textContent=nome;
    document.getElementById('perfil-email').textContent=email;
    document.getElementById('perfil-tipo').textContent='Cliente TrustBook';

    // Form
    document.getElementById('inp-nome').value=perfil.nome||'';
    document.getElementById('inp-email').value=email;
    document.getElementById('inp-cpf').value=perfil.cpf||'';
    document.getElementById('inp-tel').value=perfil.telefone||'';
    document.getElementById('inp-nasc').value=perfil.nascimento||'';
    document.getElementById('inp-cidade').value=perfil.cidade||'';
    document.getElementById('inp-estado').value=perfil.estado||'';

    // Idade
    const idade=calcIdade(perfil.nascimento);
    document.getElementById('idade-num').textContent=idade!==null?idade:'--';
    document.getElementById('badge-idade').textContent=idade!==null?'🎂 '+idade+' anos':'🎂 Idade: --';

    const idadeMsg=document.getElementById('idade-msg');
    if(idade===null){
      idadeMsg.textContent='Informe sua data de nascimento em Informações Pessoais';
      idadeMsg.style.color='var(--t3)';
    } else if(idade>=18){
      idadeMsg.textContent='🔓 Acesso liberado a todos os eventos, incluindo +18';
      idadeMsg.style.color='#22c55e';
    } else {
      idadeMsg.textContent='🔒 Eventos classificados +18 estarão ocultos para você';
      idadeMsg.style.color='#ffa94d';
    }

    // Score
    const total=score.base+score.agend*10+score.presenca*5+score.avaliac*3-score.cancel*15-score.noshow*25;
    document.querySelectorAll('.sc-ag').forEach(e=>e.textContent='+'+score.agend*10);
    document.querySelectorAll('.sc-pr').forEach(e=>e.textContent='+'+score.presenca*5);
    document.querySelectorAll('.sc-av').forEach(e=>e.textContent='+'+score.avaliac*3);
    document.querySelectorAll('.sc-ca').forEach(e=>e.textContent='-'+score.cancel*15);
    document.querySelectorAll('.sc-ns').forEach(e=>e.textContent='-'+score.noshow*25);
    document.getElementById('score-num').textContent=total;
    document.getElementById('score-total').textContent=total+' pontos';
    document.getElementById('badge-score').textContent='⭐ '+total+' pontos';

    const scoreLabel=document.getElementById('score-label');
    if(total>=100){scoreLabel.textContent='Excelente reputação';scoreLabel.style.color='#22c55e'}
    else if(total>=70){scoreLabel.textContent='Boa reputação';scoreLabel.style.color='#4f8cff'}
    else if(total>=40){scoreLabel.textContent='Reputação regular';scoreLabel.style.color='#ffa94d'}
    else{scoreLabel.textContent='Reputação baixa';scoreLabel.style.color='#ff5c7a'}

    const maxScore=100;
    const pctArc=Math.min(total/maxScore,1);
    const offset=251-(pctArc*251);
    document.getElementById('score-arc').setAttribute('stroke-dashoffset',offset);
    document.getElementById('score-arc').setAttribute('stroke',total>=100?'#22c55e':total>=70?'#4f8cff':total>=40?'#ffa94d':'#ff5c7a');

    // Stats
    document.getElementById('stat-agend').textContent=score.agend;
    document.getElementById('stat-presenca').textContent=score.presenca;
    document.getElementById('stat-cancel').textContent=score.cancel;
    document.getElementById('stat-avaliac').textContent=score.avaliac;

    // ─── CLASSIFICAÇÃO ETÁRIA ──────────────────────────────
    const clfList=document.getElementById('clf-list');
    const badgeClf=document.getElementById('badge-clf');

    if(idade===null){
      clfList.innerHTML='<div style="text-align:center;padding:20px;color:var(--t3);font-size:.85rem">Informe sua data de nascimento em Informações Pessoais</div>';
      badgeClf.textContent='🔞 Classificação: --';
      badgeClf.style.background='rgba(91,108,255,.1)';
      badgeClf.style.color='#8b9cff';
      return;
    }

    let maxLabel='Livre';
    let maxCor='#22c55e';
    CLASSIF.forEach(function(c){
      const min=c.val==='livre'?0:parseInt(c.val);
      if(idade>=min){maxLabel=c.label;maxCor=c.cor}
    });

    badgeClf.textContent='🔞 Acesso: '+maxLabel;
    badgeClf.style.background='rgba(91,108,255,.1)';
    badgeClf.style.color=maxCor;

    let html='';
    CLASSIF.forEach(function(c){
      const min=c.val==='livre'?0:parseInt(c.val);
      const liberado=idade>=min;

      if(liberado){
        html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.15);border-radius:8px">';
        html+='  <span style="font-size:.85rem;color:var(--t2)">'+c.icon+' '+c.label+'</span>';
        html+='  <span style="font-size:.78rem;font-weight:700;color:#22c55e;display:flex;align-items:center;gap:4px">🔓 Liberado</span>';
        html+='</div>';
      } else {
        html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:8px">';
        html+='  <span style="font-size:.85rem;color:var(--t3)">'+c.icon+' '+c.label+'</span>';
        html+='  <span style="font-size:.78rem;font-weight:700;color:#f87171;display:flex;align-items:center;gap:4px">🔒 Bloqueado</span>';
        html+='</div>';
      }
    });

    clfList.innerHTML=html;
  }

  // ─── SALVAR ──────────────────────────────────────────────
  window.salvarPerfil=function(){
    const perfil=getPerfil();
    perfil.nome=document.getElementById('inp-nome').value;
    perfil.cpf=document.getElementById('inp-cpf').value;
    perfil.telefone=document.getElementById('inp-tel').value;
    perfil.nascimento=document.getElementById('inp-nasc').value;
    perfil.cidade=document.getElementById('inp-cidade').value;
    perfil.estado=document.getElementById('inp-estado').value;
    savePerfil(perfil);
    showToast('Perfil salvo com sucesso!','ok');
    render();
  };

  render();
})();
</script>

<?php include __DIR__.'/../includes/footer.php'; ?>
>>>>>>> b1b1aa3e65c1da5d208560bab19757ac48d7d370
