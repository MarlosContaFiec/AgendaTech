<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
  } 
  $pageTitle='Explorar';
   $currentPage='explorar';
    include'../includes/header.php';
     include'../includes/sidebar.php'; ?>

<div class="sh">
  <div>
    <h1>Explorar Serviços</h1>
    <p id="count-sub">7 encontrado(s)</p>
  </div>
</div>

<div class="fcard" style="padding:14px 20px !important">
  <div style="display:flex;gap:10px;align-items:center;">
    <div style="position:relative;flex:3">
      <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#7c819a;font-size:14px">🔍</span>
      <input type="text" class="fi" id="f-search" placeholder="Buscar..." oninput="renderCards()" style="padding-left:36px;padding-top:8px;padding-bottom:8px;font-size:13px">
    </div>
    <select class="fs" id="f-tipo" onchange="renderCards()" style="width:100px;padding:8px 10px;font-size:13px;border-radius:8px;background:#1a1e29;border:1px solid #2a2f42;color:#e8eaf2;cursor:pointer">
      <option value="">Tipo</option>
      <option>Salão</option><option>Clínica</option><option>Academia</option><option>Estúdio</option><option>Spa</option><option>Restaurante</option>
    </select>
    <select class="fs" id="f-estado" onchange="updCid();renderCards()" style="width:100px;padding:8px 10px;font-size:13px;border-radius:8px;background:#1a1e29;border:1px solid #2a2f42;color:#e8eaf2;cursor:pointer">
      <option value="">UF</option>
      <option>SP</option><option>RJ</option><option>MG</option>
    </select>
    <select class="fs" id="f-cidade" onchange="renderCards()" style="width:100px;padding:8px 10px;font-size:13px;border-radius:8px;background:#1a1e29;border:1px solid #2a2f42;color:#e8eaf2;cursor:pointer">
      <option value="">Cidade</option>
    </select>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
      <span style="font-size:12px;color:#7c819a">📍</span>
      <input type="range" min="1" max="100" value="50" id="f-dist" oninput="document.getElementById('dv').textContent=this.value+'km';renderCards()" style="width:80px;height:3px;accent-color:#5b6cff">
      <span style="font-size:13px;color:#5b6cff;font-weight:700;min-width:36px" id="dv">50km</span>
    </div>
    <button class="btn btn-g btn-s" onclick="getLoc()" id="btn-loc" style="padding:8px 12px;font-size:12px;white-space:nowrap">🎯 Local</button>
  </div>
</div>


<div class="eg" id="eg"></div>

<!-- MODAL DETALHES -->
<div class="mo" id="m-det"><div class="mb" id="m-det-c"></div></div>
<!-- MODAL CONFIRMAR -->
<div class="mo" id="m-conf"><div class="mb" id="m-conf-c"></div></div>
<!-- MODAL CANCELAR -->
<div class="mo" id="m-canc"><div class="mb" id="m-canc-c"></div></div>
<!-- MODAL FILA -->
<div class="mo" id="m-fila"><div class="mb" id="m-fila-c"></div></div>
<!-- MODAL RESERVA -->
<div class="mo" id="m-res"><div class="mb wide" id="m-res-c"></div></div>
<!-- MODAL POLÍTICA -->
<div class="mo" id="m-pol"><div class="mb" id="m-pol-c"></div></div>

<script>
let userLoc=null;

function updCid(){
  const e=document.getElementById('f-estado').value,s=document.getElementById('f-cidade');
  s.innerHTML='<option value="">Cidades</option>'+(CIDADES[e]||[]).map(c=>'<option>'+c+'</option>').join('');
}

function getLoc(){
  if(!navigator.geolocation)return showToast('Geolocalização não suportada','e');
  navigator.geolocation.getCurrentPosition(p=>{userLoc={lat:p.coords.latitude,lng:p.coords.longitude};document.getElementById('btn-loc').textContent='✓ Local ativa';document.getElementById('btn-loc').style.color='var(--ok)';renderCards()},()=>showToast('Não foi possível obter localização','e'));
}

function renderCards(){
  const regs=getRegs(),search=document.getElementById('f-search').value.toLowerCase(),tipo=document.getElementById('f-tipo').value,estado=document.getElementById('f-estado').value,cidade=document.getElementById('f-cidade').value,dist=+document.getElementById('f-dist').value;
  const perfil=getPerfil(),idade=calcIdade(perfil.nascimento);
  const f=EVENTOS.filter(ev=>{
    if(idade<({livre:0,"10":10,"12":12,"14":14,"16":16,"18":18}[ev.clf]||0))return false;
    if(search&&!ev.titulo.toLowerCase().includes(search)&&!ev.estab.toLowerCase().includes(search)&&!ev.desc.toLowerCase().includes(search))return false;
    if(tipo&&ev.tipo!==tipo)return false;
    if(estado&&ev.estado!==estado)return false;
    if(cidade&&ev.cidade!==cidade)return false;
    if(userLoc&&ev.lat&&ev.lng&&calcDist(userLoc.lat,userLoc.lng,ev.lat,ev.lng)>dist)return false;
    return true;
  });
  document.getElementById('count-sub').textContent=f.length+' encontrado(s)';

  const grid=document.getElementById('eg');
  if(!f.length){grid.innerHTML='<div class="empty"><div class="ei">🔍</div><h3>Nenhum serviço encontrado.</h3><p>Tente ajustar os filtros.</p></div>';return;}

  grid.innerHTML=f.map(ev=>{
    const r=regs[ev.id]||{};const lot=r.count||0;const pct=ev.lotacao?lot/ev.lotacao:0;const cl=CLASSIF[ev.clf]||CLASSIF.livre;
    const isFull=ev.lotacao!==null&&lot>=ev.lotacao;const ins=!!r.inscrito;const pend=!!r.pendente;const fi=(ev.fila||[]).findIndex(x=>x.cid===CLIENT_ID);
    const fA=(ev.fila||[]).length,fL=ev.limFila||3;

    let badge=ins?'<span class="bdg bdg-ok">✓ Inscrito</span>':pend?'<span class="bdg bdg-w">⏳ Pendente</span>':ev.publico?'<span class="bdg bdg-ok">Público</span>':'<span class="bdg bdg-a">Inscrição</span>';
    if(isFull&&!ins&&fi<0)badge='<span class="bdg bdg-e">Esgotado</span>';
    if(fi>=0)badge='<span class="bdg bdg-a">⏳ Fila #'+(fi+1)+'</span>';

    let btn=ins?'<button class="btn btn-d btn-s" onclick="modCanc('+ev.id+')">Cancelar</button>':pend?'<button class="btn btn-d btn-s" onclick="modCanc('+ev.id+')">Cancelar Sol.</button>':isFull&&fi<0?(fA>=fL?'<button class="btn btn-dis btn-s" disabled>Fila cheia</button>':'<button class="btn btn-w btn-s" onclick="modFila('+ev.id+')">⏳ Fila</button>'):fi>=0?'<button class="btn btn-w btn-s" onclick="sairF('+ev.id+')">Sair da Fila</button>':ev.publico?'<button class="btn btn-p btn-s" onclick="modDet('+ev.id+')">Ver Detalhes</button>':'<button class="btn btn-p btn-s" onclick="modConf('+ev.id+')">Inscrever-se</button>';

    let lotHtml='';
    if(ev.lotacao){const cor=lotColor(pct);lotHtml='<div class="lot"><div class="lot-inf"><span class="lot-lb">Lotação</span><span class="lot-nm" style="color:'+cor+'">'+lot+'/'+ev.lotacao+'</span></div><div class="bar"><div class="bar-f" style="width:'+Math.min(pct*100,100)+'%;background:'+cor+'"></div></div>'+(isFull&&!ins?'<div class="fi2">Fila: '+fA+'/'+fL+'</div>':'')+'</div>';}
    let precoHtml=ev.preco?'<div class="prc">💰 R$ '+ev.preco.toFixed(2)+'</div>':'';

    return '<div class="card ec"><div class="ch"><div class="badges">'+badge+badgeClassif(ev.clf)+'<span class="loc">'+ev.cidade+' · '+ev.estado+'</span></div><div class="ttl">'+ev.titulo+'</div><div class="sub">📍 '+ev.estab+' · '+ev.tipo+'</div>'+precoHtml+'</div><div class="cb"><p class="desc">'+ev.desc+'</p><div class="dt">📅 '+formatDate(ev.data)+'</div><div class="times">'+ev.horarios.map(h=>'<span class="tc">🕐 '+h+'</span>').join('')+'</div>'+lotHtml+'</div><div class="cf"><button class="btn btn-g btn-s" onclick="modDet('+ev.id+')">Detalhes</button>'+btn+'</div></div>';
  }).join('');
}

// ─── MODAL DETALHES ────────────────────────────────────────────
function modDet(id){
  const ev=EVENTOS.find(e=>e.id===id);if(!ev)return;
  const regs=getRegs(),r=regs[id]||{};const lot=r.count||0;const cl=CLASSIF[ev.clf]||CLASSIF.livre;const pct=ev.lotacao?lot/ev.lotacao:0;const isFull=ev.lotacao!==null&&lot>=ev.lotacao;const ins=!!r.inscrito;const fi=(ev.fila||[]).findIndex(x=>x.cid===CLIENT_ID);const fA=(ev.fila||[]).length,fL=ev.limFila||3;
  let h='<div class="mh"><div><div class="badges" style="margin-bottom:8px">'+(ins?'<span class="bdg bdg-ok">✓ Inscrito</span>':pend(ev)?'<span class="bdg bdg-w">⏳ Aguardando</span>':isFull?'<span class="bdg bdg-e">Esgotado</span>':'')+' '+badgeClassif(ev.clf)+(ev.preco?' <span class="bdg bdg-ok">💰 R$ '+ev.preco.toFixed(2)+'</span>':'')+'</div><h3>'+ev.titulo+'</h3><div class="sub">'+ev.estab+' · '+ev.cidade+', '+ev.estado+'</div></div><button class="mcl" onclick="closeModal(\'m-det\')">×</button></div>';
  h+='<div class="mbd"><p style="color:var(--t2);line-height:1.6;margin-bottom:16px">'+ev.desc+'</p>';
  [['🏢',ev.tipo+' — '+ev.estab],['📅','Data: '+formatDate(ev.data)],['🕐','Horários: '+ev.horarios.join(' · ')],['📍',ev.cidade+', '+ev.estado]].forEach(([i,t])=>{h+='<div style="display:flex;gap:8px;margin-bottom:8px;align-items:start"><span>'+i+'</span><span style="font-size:.875rem;color:var(--t2)">'+t+'</span></div>'});
  if(ev.preco)h+='<div style="display:flex;gap:8px;margin-bottom:8px"><span>💰</span><span style="color:var(--ok);font-weight:700">R$ '+ev.preco.toFixed(2)+' por pessoa</span></div>';
  if(ev.lotacao){h+='<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--brd)"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:.78rem;color:var(--t3)">Vagas</span><span style="font-weight:700;color:'+lotColor(pct)+'">'+lot+'/'+ev.lotacao+'</span></div><div class="bar" style="height:7px"><div class="bar-f" style="width:'+Math.min(pct*100,100)+'%;background:'+lotColor(pct)+'"></div></div>'+(isFull?'<div style="margin-top:8px;font-size:.78rem;color:var(--acl)">Fila: '+fA+'/'+fL+'</div>':'')+'</div>';}
  h+='</div><div class="mft"><button class="btn btn-g" onclick="closeModal(\'m-det\')">Fechar</button>';
  if(!ev.publico&&!isFull&&!ins&&!pend(ev)&&fi<0)h+='<button class="btn btn-p" onclick="closeModal(\'m-det\');modConf('+id+')">Inscrever-se</button>';
  if(!ev.publico&&!ins&&!pend(ev)&&!isFull&&fi<0&&fA<fL)h+='<button class="btn btn-w" onclick="closeModal(\'m-det\');modFila('+id+')">⏳ Entrar na Fila</button>';
  if(fi>=0)h+='<button class="btn btn-d" onclick="closeModal(\'m-det\');sairF('+id+')">Sair da Fila</button>';
  if(pend(ev))h+='<button class="btn btn-d" onclick="closeModal(\'m-det\');modCanc('+id+')">Cancelar Solicitação</button>';
  if(ins)h+='<button class="btn btn-d" onclick="closeModal(\'m-det\');modCanc('+id+')">Cancelar Inscrição</button>';
  h+='</div>';
  document.getElementById('m-det-c').innerHTML=h;openModal('m-det');
}
function pend(ev){const r=getRegs()[ev.id];return r&&r.pendente}

// ─── MODAL CONFIRMAR ───────────────────────────────────────────
let selHorario=null;
function modConf(id){
  const ev=EVENTOS.find(e=>e.id===id);if(!ev)return;
  selHorario=ev.horarios[0];const regs=getRegs();const ja=!!regs[id]?.inscrito;
  let h='<div class="mh"><div><p style="font-size:.78rem;color:var(--t3);margin-bottom:4px">Confirmar inscrição em</p><h3>'+ev.titulo+'</h3><div class="sub">'+ev.estab+' · '+ev.cidade+'</div></div><button class="mcl" onclick="closeModal(\'m-conf\')">×</button></div>';
  h+='<div class="mbd"><div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:14px 16px;margin-bottom:16px;display:flex;justify-content:space-between"><span style="font-size:.78rem;color:var(--t3)">Data</span><span style="font-size:.875rem;font-weight:600">'+formatDate(ev.data)+'</span></div>';
  h+='<div style="margin-bottom:16px"><p style="font-size:.72rem;color:var(--t3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">Horário'+(ev.horarios.length>1?' (máx. 2)':'')+'</p><div style="display:flex;flex-wrap:wrap;gap:8px">'+ev.horarios.map(x=>'<button class="hsel'+(x===selHorario?' act':'')+'" onclick="selH(this,\''+x+'\')">🕐 '+x+'</button>').join('')+'</div>';
  if(ja)h+='<div style="margin-top:8px;background:rgba(255,169,77,.08);border:1px solid rgba(255,169,77,.25);border-radius:8px;padding:8px 12px;font-size:.78rem;color:var(--org)">⚠️ Já tem agendamento — justifique para adicionar outro.</div>';
  h+='</div>';
  h+='<p style="font-size:.875rem;color:var(--t3)">Ao confirmar, será adicionado ao seu <strong style="color:var(--t1)">Calendário</strong>.</p>';
  h+='</div><div class="mft"><button class="btn btn-g" onclick="closeModal(\'m-conf\')">Voltar</button><button class="btn btn-p" onclick="confIns('+id+')">✓ Confirmar Inscrição</button></div>';
  document.getElementById('m-conf-c').innerHTML=h;openModal('m-conf');
}
function selH(btn,h){selHorario=h;document.querySelectorAll('#m-conf .hsel').forEach(b=>{b.classList.remove('act')});btn.classList.add('act')}
function confIns(id){const regs=getRegs();regs[id]={inscrito:true,horario:selHorario||EVENTOS.find(e=>e.id===id).horarios[0],count:(regs[id]?.count||0)+1};saveRegs(regs);closeModal('m-conf');showToast('Inscrição confirmada!','ok');renderCards()}

// ─── MODAL CANCELAR ────────────────────────────────────────────
let selMotivo=null;
function modCanc(id){
  const ev=EVENTOS.find(e=>e.id===id);if(!ev)return;selMotivo=null;
  let h='<div class="mh"><div><p style="font-size:.78rem;color:var(--err2);margin-bottom:4px">Cancelar inscrição em</p><h3>'+ev.titulo+'</h3></div><button class="mcl" onclick="closeModal(\'m-canc\')">×</button></div>';
  h+='<div class="mbd"><p style="font-size:.875rem;color:var(--t3);margin-bottom:14px">Informe o motivo:</p><div style="display:flex;flex-direction:column;gap:8px">';
  MOTIVOS_CANC.forEach(m=>{h+='<label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px;border-radius:10px;border:1px solid var(--brd);background:var(--bg3);font-size:.875rem;transition:all .15s" onclick="selM(this,\''+m+'\')"><input type="radio" name="m" style="accent-color:#5b6cff"> '+m+'</label>'});
  h+='</div></div><div class="mft"><button class="btn btn-g" onclick="closeModal(\'m-canc\')">Voltar</button><button class="btn btn-d" onclick="confCanc('+id+')">Cancelar Inscrição</button></div>';
  document.getElementById('m-canc-c').innerHTML=h;openModal('m-canc');
}
function selM(lbl,m){selMotivo=m;lbl.style.background='rgba(91,108,255,.1)';lbl.style.borderColor='#5b6cff';lbl.querySelector('input').checked=true}
function confCanc(id){if(!selMotivo)return showToast('Selecione um motivo','e');const regs=getRegs();delete regs[id];saveRegs(regs);closeModal('m-canc');showToast('Cancelado.','i');renderCards()}

// ─── MODAL FILA ────────────────────────────────────────────────
let selFilaH=null;
function modFila(id){
  const ev=EVENTOS.find(e=>e.id===id);if(!ev)return;
  const ins=ev.inscritos||[],fil=ev.fila||[],lim=ev.limFila||3;
  const occ=ev.horarios.filter(h=>ins.some(i=>i.horario===h));
  const hf=occ.length>0?occ:ev.horarios;selFilaH=hf[0]||'';
  const nF=fil.filter(f=>f.horario===selFilaH).length;

  let h='<div class="mh"><div><p style="font-size:.72rem;color:var(--acl);margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">⏳ Entrar na Fila de Espera</p><h3>'+ev.titulo+'</h3><div class="sub">'+ev.estab+'</div></div><button class="mcl" onclick="closeModal(\'m-fila\')">×</button></div>';
  h+='<div class="mbd"><div class="ibox"><h4>ℹ️ Como funciona?</h4><p>Se alguém cancelar, você recebe notificação e pode aceitar ou recusar a vaga.</p></div>';
  h+='<div style="margin-bottom:16px"><p style="font-size:.72rem;color:var(--t3);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">Horário ocupado <span style="color:var(--err2);margin-left:4px">(já reservado)</span></p><div style="display:flex;flex-wrap:wrap;gap:8px">'+hf.map(x=>'<button class="hsel'+(x===selFilaH?' act':'')+'" onclick="selFH(this,\''+x+'\')">🕐 '+x+'</button>').join('')+'</div></div>';
  if(selFilaH){const nF2=fil.filter(f=>f.horario===selFilaH).length;h+='<div style="background:var(--bg3);border:1px solid var(--brd);border-radius:12px;padding:14px 16px;margin-bottom:16px"><p style="font-size:.75rem;color:var(--t3);margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em">Fila — '+selFilaH+'</p><div style="display:flex;gap:16px"><div style="flex:1"><p style="font-size:.72rem;color:var(--t3);margin-bottom:4px">Na fila</p><p style="font-size:1.5rem;font-weight:800;color:'+(nF2>=lim?'var(--err2)':'var(--acl)')+'">'+nF2+'<span style="font-size:.78rem;color:var(--t3);font-weight:400">/'+lim+'</span></p></div><div style="flex:1"><p style="font-size:.72rem;color:var(--t3);margin-bottom:4px">Sua posição</p><p style="font-size:1.5rem;font-weight:800;color:var(--ok)">#'+(nF2+1)+'</p></div></div><div class="bar" style="margin-top:12px;height:6px"><div class="bar-f" style="width:'+Math.min((nF2/lim)*100,100)+'%;background:'+(nF2>=lim?'var(--err)':'var(--ac)')+'"></div></div><p style="font-size:.68rem;margin-top:4px;color:'+(nF2>=lim?'var(--err2)':'var(--t3)')+'">'+(nF2>=lim?'Fila cheia':(lim-nF2)+' vaga(s) restante(s)')+'</p></div>';}
  h+='<div class="alert" style="background:rgba(255,169,77,.08);border-color:rgba(255,169,77,.25);color:var(--org)">⚠️ Você será notificado se surgir vaga. Poderá <strong>aceitar ou recusar</strong>.</div>';
  h+='</div><div class="mft"><button class="btn btn-g" onclick="closeModal(\'m-fila\')">Cancelar</button><button class="btn btn-w" onclick="confFila('+id+')">⏳ Ficar na Fila</button></div>';
  document.getElementById('m-fila-c').innerHTML=h;openModal('m-fila');
}
function selFH(btn,h){selFilaH=h;document.querySelectorAll('#m-fila .hsel').forEach(b=>{b.classList.remove('act')});btn.classList.add('act')}
function confFila(id){const ev=EVENTOS.find(e=>e.id===id);if(!ev)return;if(!ev.fila)ev.fila=[];ev.fila.push({cid:CLIENT_ID,horario:selFilaH||ev.horarios[0]});closeModal('m-fila');showToast('Você entrou na fila!','i');renderCards()}
function sairF(id){const ev=EVENTOS.find(e=>e.id===id);if(ev)ev.fila=(ev.fila||[]).filter(f=>f.cid!==CLIENT_ID);showToast('Saiu da fila.','i');renderCards()}

// ─── MODAL POLÍTICA ────────────────────────────────────────────
function modPol(nextId){
  let h='<div class="mh"><div><p style="font-size:.72rem;color:var(--warn);margin-bottom:4px;text-transform:uppercase">⚠️ Política de Cancelamento</p><h3>Leia antes de confirmar</h3></div><button class="mcl" onclick="closeModal(\'m-pol\')">×</button></div>';
  h+='<div class="mbd"><div style="background:rgba(255,169,77,.08);border:1px solid rgba(255,169,77,.25);border-radius:12px;padding:14px 16px;margin-bottom:16px"><p style="font-size:.875rem;font-weight:700;color:var(--warn);margin-bottom:8px">⏰ Prazo: '+POLITICA.horas+'h</p><p style="font-size:.875rem;color:var(--t2);line-height:1.6">'+POLITICA.desc+'</p></div>';
  h+='<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px"><div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:12px 16px;display:flex;gap:10px;align-items:start"><span>✅</span><div><p style="font-size:.875rem;font-weight:700;color:var(--ok);margin-bottom:2px">Mais de '+POLITICA.horas+'h</p><p style="font-size:.78rem;color:var(--t2)">Reembolso integral.</p></div></div><div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:12px 16px;display:flex;gap:10px;align-items:start"><span>❌</span><div><p style="font-size:.875rem;font-weight:700;color:var(--err2);margin-bottom:2px">Menos de '+POLITICA.horas+'h</p><p style="font-size:.78rem;color:var(--t2)">Sem reembolso.</p></div></div></div>';
  h+='<label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:12px;border-radius:10px;border:1px solid var(--brd);background:var(--bg3);font-size:.875rem"><input type="checkbox" id="pol-aceito" style="accent-color:#5b6cff;width:16px;height:16px" onchange="document.getElementById(\'pol-btn\').disabled=!this.checked;document.getElementById(\'pol-btn\').className=this.checked?\'btn btn-p\':\'btn btn-dis\'"> Li e aceito a política</label>';
  h+='</div><div class="mft"><button class="btn btn-g" onclick="closeModal(\'m-pol\')">Voltar</button><button class="btn btn-dis" id="pol-btn" disabled onclick="closeModal(\'m-pol\');modConf('+nextId+')">Continuar</button></div>';
  document.getElementById('m-pol-c').innerHTML=h;openModal('m-pol');
}

// INIT
document.addEventListener('DOMContentLoaded',()=>{renderCards()});
</script>

<?php include'../includes/footer.php'; ?>
