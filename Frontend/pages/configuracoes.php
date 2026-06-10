<<<<<<< HEAD
<?php 
session_start(); 
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
} 
  $pageTitle='Configurações'; 
  $currentPage='configuracoes'; 
  include __DIR__.'/../includes/header.php'; 
  include __DIR__.'/../includes/sidebar.php'; 
?>


<div class="sh"><div><h1>Configurações</h1><p>Preferências e privacidade</p></div></div>
<div style="max-width:640px;display:flex;flex-direction:column;gap:24px">
  <div><h3 style="font-size:.875rem;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--t3)">Notificações</h3>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div class="trow"><div class="tlbl"><div class="tt">No app</div><div class="td">Alertas na plataforma</div></div><button class="tog on" onclick="this.classList.toggle('on')"></button></div>
      <div class="trow"><div class="tlbl"><div class="tt">E-mail</div><div class="td">Atualizações por e-mail</div></div><button class="tog on" onclick="this.classList.toggle('on')"></button></div>
      <div class="trow"><div class="tlbl"><div class="tt">WhatsApp</div><div class="td">Alertas via WhatsApp</div></div><button class="tog" onclick="this.classList.toggle('on')"></button></div>
    </div>
  </div>
  <div><h3 style="font-size:.875rem;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--t3)">Privacidade</h3><div class="card" style="padding:20px"><p style="font-size:.875rem;color:var(--t2);line-height:1.6">Dados armazenados localmente. Compartilhados apenas com estabelecimentos onde você se inscreve.</p></div></div>
  <button class="btn btn-p" onclick="showToast('Salvo!','ok')">Salvar</button>
</div>
<?php include __DIR__.'../includes/footer.php'; ?>
=======
<?php
session_start();
if(!isset($_SESSION['email'])){
  header('Location:../login.php');
  exit;
}
$pageTitle='Configurações';
$currentPage='configuracoes';
include __DIR__.'/../includes/header.php';
include __DIR__.'/../includes/sidebar.php';
?>

<div class="sh">
  <div>
    <h1>Configurações</h1>
    <p>Gerencie suas preferências e acessibilidade</p>
  </div>
</div>

<!-- CONFIGURAÇÕES GERAIS -->
<div class="card" style="padding:20px;margin-bottom:20px">
  <h3 style="margin-bottom:16px;font-size:1rem">⚙️ Configurações Gerais</h3>

  <div style="display:flex;flex-direction:column;gap:10px">

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🔔</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Notificações</div>
          <div style="font-size:.75rem;color:var(--t3)">Receber alertas de agendamentos e fila</div>
        </div>
      </div>
      <button class="tog on" id="cfg-notif" onclick="toggleCfg('notif')"></button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🔔</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Lembrete por E-mail</div>
          <div style="font-size:.75rem;color:var(--t3)">Enviar lembrete 24h antes do evento</div>
        </div>
      </div>
      <button class="tog on" id="cfg-email" onclick="toggleCfg('email')"></button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🔔</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Som de Notificação</div>
          <div style="font-size:.75rem;color:var(--t3)">Tocar som ao receber notificações</div>
        </div>
      </div>
      <button class="tog" id="cfg-som" onclick="toggleCfg('som')"></button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">👤</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Perfil Público</div>
          <div style="font-size:.75rem;color:var(--t3)">Permitir que empresas vejam seu perfil</div>
        </div>
      </div>
      <button class="tog on" id="cfg-publico" onclick="toggleCfg('publico')"></button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">📍</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Localização Automática</div>
          <div style="font-size:.75rem;color:var(--t3)">Usar GPS para filtrar eventos próximos</div>
        </div>
      </div>
      <button class="tog" id="cfg-gps" onclick="toggleCfg('gps')"></button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🌐</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Idioma</div>
          <div style="font-size:.75rem;color:var(--t3)">Idioma da interface</div>
        </div>
      </div>
      <select id="cfg-idioma" style="background:var(--bg4);border:1px solid var(--brd);border-radius:8px;padding:6px 10px;font-size:.8rem;color:var(--t1);font-family:inherit;cursor:pointer">
        <option value="pt-BR" selected>Português (BR)</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>

  </div>
</div>

<!-- ACESSIBILIDADE -->
<div class="card" style="padding:20px;margin-bottom:20px">
  <h3 style="margin-bottom:16px;font-size:1rem">♿ Acessibilidade</h3>

  <!-- APARÊNCIA -->
  <div style="margin-bottom:20px">
    <div style="font-size:.72rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">🎨 Aparência</div>

    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:18px">🌙</span>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Modo Escuro</div>
            <div style="font-size:.75rem;color:var(--t3)">Tema escuro para reduzir cansaço visual</div>
          </div>
        </div>
        <button class="tog on" id="acc-dark" onclick="toggleAcc('dark')"></button>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:18px">🔲</span>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Contraste Alto</div>
            <div style="font-size:.75rem;color:var(--t3)">Bordas mais fortes e cores mais intensas</div>
          </div>
        </div>
        <button class="tog" id="acc-contrast" onclick="toggleAcc('contrast')"></button>
      </div>
    </div>
  </div>

  <!-- TEXTO -->
  <div style="margin-bottom:20px">
    <div style="font-size:.72rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">📝 Texto</div>

    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">🔤</span>
            <span style="font-size:.875rem;font-weight:600;color:var(--t1)">Tamanho do Texto</span>
          </div>
          <span style="font-size:.78rem;font-weight:700;color:var(--acl);background:var(--acg);padding:2px 8px;border-radius:6px" id="acc-font-val">16px</span>
        </div>
        <input type="range" class="acc-slider" id="acc-font" min="12" max="22" value="16" oninput="applyFont(this.value)">
        <div style="display:flex;justify-content:space-between;margin-top:4px">
          <span style="font-size:.65rem;color:var(--t4)">Pequeno</span>
          <span style="font-size:.65rem;color:var(--t4)">Grande</span>
        </div>
      </div>

      <div style="padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">↔️</span>
            <span style="font-size:.875rem;font-weight:600;color:var(--t1)">Espaço entre Palavras</span>
          </div>
          <span style="font-size:.78rem;font-weight:700;color:var(--acl);background:var(--acg);padding:2px 8px;border-radius:6px" id="acc-word-val">0px</span>
        </div>
        <input type="range" class="acc-slider" id="acc-word" min="0" max="8" value="0" oninput="applyWordSpacing(this.value)">
      </div>

      <div style="padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">↕️</span>
            <span style="font-size:.875rem;font-weight:600;color:var(--t1)">Espaço entre Linhas</span>
          </div>
          <span style="font-size:.78rem;font-weight:700;color:var(--acl);background:var(--acg);padding:2px 8px;border-radius:6px" id="acc-line-val">1.5</span>
        </div>
        <input type="range" class="acc-slider" id="acc-line" min="12" max="28" value="15" step="1" oninput="applyLineHeight(this.value)">
      </div>
    </div>
  </div>

  <!-- INTERAÇÃO -->
  <div style="margin-bottom:20px">
    <div style="font-size:.72rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">🖱️ Interação</div>

    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:18px">👆</span>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Cursor Grande</div>
            <div style="font-size:.75rem;color:var(--t3)">Aumenta o cursor do mouse</div>
          </div>
        </div>
        <button class="tog" id="acc-cursor" onclick="toggleAcc('cursor')"></button>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:18px">🚫</span>
          <div>
            <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Reduzir Animações</div>
            <div style="font-size:.75rem;color:var(--t3)">Desliga transições e animações</div>
          </div>
        </div>
        <button class="tog" id="acc-motion" onclick="toggleAcc('motion')"></button>
      </div>
    </div>
  </div>

  <!-- CORES -->
  <div>
    <div style="font-size:.72rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px">🎨 Cores</div>

    <div style="padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">💧</span>
          <span style="font-size:.875rem;font-weight:600;color:var(--t1)">Saturação</span>
        </div>
        <span style="font-size:.78rem;font-weight:700;color:var(--acl);background:var(--acg);padding:2px 8px;border-radius:6px" id="acc-sat-val">100%</span>
      </div>
      <input type="range" class="acc-slider" id="acc-sat" min="0" max="100" value="100" oninput="applySaturation(this.value)">
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span style="font-size:.65rem;color:var(--t4)">Sem cor</span>
        <span style="font-size:.65rem;color:var(--t4)">Vibrante</span>
      </div>
    </div>
  </div>
</div>

<!-- CONTA -->
<div class="card" style="padding:20px;margin-bottom:20px">
  <h3 style="margin-bottom:16px;font-size:1rem">🔐 Conta</h3>

  <div style="display:flex;flex-direction:column;gap:10px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:var(--bg3);border:1px solid var(--brd);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🔑</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:var(--t1)">Alterar Senha</div>
          <div style="font-size:.75rem;color:var(--t3)">Atualize sua senha de acesso</div>
        </div>
      </div>
      <button class="btn btn-g btn-s" style="padding:8px 16px;font-size:.78rem">Alterar</button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.12);border-radius:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:18px">🗑️</span>
        <div>
          <div style="font-size:.875rem;font-weight:600;color:#f87171">Excluir Conta</div>
          <div style="font-size:.75rem;color:var(--t3)">Remover permanentemente sua conta</div>
        </div>
      </div>
      <button class="btn btn-d btn-s" style="padding:8px 16px;font-size:.78rem">Excluir</button>
    </div>
  </div>
</div>

<!-- BOTÃO REDEFINIR -->
<div style="display:flex;justify-content:flex-end;gap:10px;margin-bottom:40px">
  <button class="btn btn-d" onclick="resetTudo()">Redefinir Tudo</button>
  <button class="btn btn-p" onclick="salvarTudo()">💾 Salvar Configurações</button>
</div>

<script>
(function(){
  // ─── CONFIGURAÇÕES GERAIS ────────────────────────────────
  const CFG_KEY='trustbook_cfg';

  function getCfg(){
    try{const d=localStorage.getItem(CFG_KEY);return d?JSON.parse(d):{notif:true,email:true,som:false,publico:true,gps:false,idioma:'pt-BR'}}catch{return{notif:true,email:true,som:false,publico:true,gps:false,idioma:'pt-BR'}}
  }
  function saveCfg(d){try{localStorage.setItem(CFG_KEY,JSON.stringify(d))}catch{}}

  window.toggleCfg=function(k){
    const cfg=getCfg();cfg[k]=!cfg[k];saveCfg(cfg);renderCfg();
  };

  function renderCfg(){
    const cfg=getCfg();
    ['notif','email','som','publico','gps'].forEach(function(k){
      const btn=document.getElementById('cfg-'+k);
      if(btn)btn.classList.toggle('on',!!cfg[k]);
    });
    document.getElementById('cfg-idioma').value=cfg.idioma||'pt-BR';
  }

  document.getElementById('cfg-idioma').addEventListener('change',function(){
    const cfg=getCfg();cfg.idioma=this.value;saveCfg(cfg);
  });

  // ─── ACESSIBILIDADE ──────────────────────────────────────
  const ACC_KEY='trustbook_acc';

  function getAcc(){
    try{const d=localStorage.getItem(ACC_KEY);return d?JSON.parse(d):{}}catch{return{}}
  }
  function saveAcc(d){try{localStorage.setItem(ACC_KEY,JSON.stringify(d))}catch{}}

  window.toggleAcc=function(k){
    const a=getAcc();
    if(k==='dark')a.dark=!a.dark;
    if(k==='contrast')a.contrast=!a.contrast;
    if(k==='cursor')a.bigCursor=!a.bigCursor;
    if(k==='motion')a.reduceMotion=!a.reduceMotion;
    saveAcc(a);applyAcc();
  };

  window.applyFont=function(v){const a=getAcc();a.fontSize=parseInt(v);saveAcc(a);applyAcc()};
  window.applyWordSpacing=function(v){const a=getAcc();a.wordSpacing=parseInt(v);saveAcc(a);applyAcc()};
  window.applyLineHeight=function(v){const a=getAcc();a.lineHeight=parseInt(v)/10;saveAcc(a);applyAcc()};
  window.applySaturation=function(v){const a=getAcc();a.saturation=parseInt(v);saveAcc(a);applyAcc()};

  function setToggle(id,on){
    const btn=document.getElementById(id);
    if(btn)btn.classList.toggle('on',on);
  }

  function applyAcc(){
    const a=getAcc();

    const isDark=a.dark!==false;
    document.body.classList.toggle('light-mode',!isDark);
    setToggle('acc-dark',isDark);

    document.body.classList.toggle('high-contrast',!!a.contrast);
    setToggle('acc-contrast',!!a.contrast);

    document.body.classList.toggle('big-cursor',!!a.bigCursor);
    setToggle('acc-cursor',!!a.bigCursor);

    document.body.classList.toggle('reduce-motion',!!a.reduceMotion);
    setToggle('acc-motion',!!a.reduceMotion);

    const fs=a.fontSize||16;
    document.body.style.fontSize=fs+'px';
    document.getElementById('acc-font').value=fs;
    document.getElementById('acc-font-val').textContent=fs+'px';

    const ws=a.wordSpacing||0;
    document.body.style.wordSpacing=ws+'px';
    document.getElementById('acc-word').value=ws;
    document.getElementById('acc-word-val').textContent=ws+'px';

    const lh=a.lineHeight||1.5;
    document.body.style.lineHeight=lh;
    document.getElementById('acc-line').value=Math.round(lh*10);
    document.getElementById('acc-line-val').textContent=lh.toFixed(1);

    const sat=a.saturation!=null?a.saturation:100;
    document.body.style.filter='saturate('+sat/100+')';
    document.getElementById('acc-sat').value=sat;
    document.getElementById('acc-sat-val').textContent=sat+'%';
  }

  // ─── REDEFINIR TUDO ──────────────────────────────────────
  window.resetTudo=function(){
    localStorage.removeItem(CFG_KEY);
    localStorage.removeItem(ACC_KEY);
    document.body.classList.remove('light-mode','high-contrast','big-cursor','reduce-motion');
    document.body.style.fontSize='';
    document.body.style.wordSpacing='';
    document.body.style.lineHeight='';
    document.body.style.filter='';
    document.getElementById('acc-font').value=16;
    document.getElementById('acc-word').value=0;
    document.getElementById('acc-line').value=15;
    document.getElementById('acc-sat').value=100;
    document.getElementById('acc-font-val').textContent='16px';
    document.getElementById('acc-word-val').textContent='0px';
    document.getElementById('acc-line-val').textContent='1.5';
    document.getElementById('acc-sat-val').textContent='100%';
    renderCfg();
    applyAcc();
    showToast('Configurações redefinidas.','i');
  };

  // ─── SALVAR TUDO ─────────────────────────────────────────
  window.salvarTudo=function(){
    showToast('Configurações salvas!','ok');
  };

  // ─── INIT ────────────────────────────────────────────────
  renderCfg();
  applyAcc();
})();
</script>

<?php include __DIR__.'/../includes/footer.php'; ?>
>>>>>>> b1b1aa3e65c1da5d208560bab19757ac48d7d370
