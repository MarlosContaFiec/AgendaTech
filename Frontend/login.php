<?php
session_start();
if(isset($_GET['logout'])){session_destroy();header('Location:login.php');exit;}
if(isset($_SESSION['email'])):
  $tipo=$_SESSION['tipo']??'cliente';
  if($tipo==='empresa')header('Location:public/pages/home_empresa.php');
  else header('Location:pages/explorar.php');
  exit;
endif;
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustBook — Login</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<div class="auth-page" id="auth-page">
  <div class="auth-wrap">

    <!-- TELA LOGIN -->
    <div class="auth-card" id="tela-login">
      <div class="auth-logo">
        <div class="auth-logo-icon">T</div>
        <div>
          <div class="auth-logo-text">TrustBook</div>
          <div class="auth-logo-sub">confiança em serviços</div>
        </div>
      </div>

      <h2 class="auth-title">Bem-vindo de volta</h2>
      <p class="auth-subtitle">Entre com seu CPF ou CNPJ para acessar o painel.</p>

      <div style="display:flex;flex-direction:column;gap:14px">
        <div>
          <div class="auth-label">CPF ou CNPJ <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🪪</span>
            <input type="text" class="auth-input" id="login-doc" placeholder="000.000.000-00  ou  00.000.000/0001-00" autocomplete="off">
            <span class="auth-input-sufixo" id="login-doc-icon"></span>
          </div>
          <div class="auth-input-erro" id="login-doc-erro" style="display:none"></div>
        </div>

        <div id="login-tipo-badge" style="display:none"></div>

        <div>
          <div class="auth-label">Senha <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🔒</span>
            <input type="password" class="auth-input" id="login-senha" placeholder="Sua senha" style="padding-right:44px">
            <button type="button" class="auth-senha-toggle" onclick="toggleSenha('login-senha',this)">👁️</button>
          </div>
          <div class="auth-input-erro" id="login-senha-erro" style="display:none"></div>
        </div>

        <div id="login-alert" style="display:none"></div>

        <button class="auth-btn-primary" id="login-btn" onclick="fazerLogin()">
          Entrar →
        </button>

        <div class="auth-divisor">
          <div class="auth-divisor-line"></div>
          <span class="auth-divisor-text">não tem conta?</span>
          <div class="auth-divisor-line"></div>
        </div>

        <button class="auth-btn-ghost" onclick="mostrarTela('tela-escolha')">
          Criar uma conta
        </button>
      </div>
    </div>

    <!-- TELA ESCOLHER TIPO -->
    <div class="auth-card" id="tela-escolha" style="display:none;max-width:480px">
      <div class="auth-logo">
        <div class="auth-logo-icon">T</div>
        <div>
          <div class="auth-logo-text">TrustBook</div>
          <div class="auth-logo-sub">confiança em serviços</div>
        </div>
      </div>

      <h2 class="auth-title">Criar nova conta</h2>
      <p class="auth-subtitle">Como você vai usar o TrustBook?</p>

      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
        <div class="auth-tipo-opcao cliente" onclick="mostrarTela('tela-cadastro-cliente')">
          <div class="auth-tipo-icone cliente">👤</div>
          <div style="flex:1">
            <div class="auth-tipo-titulo">Sou Cliente</div>
            <div class="auth-tipo-desc">Quero agendar serviços, acompanhar meus horários e gerenciar meu histórico.</div>
          </div>
          <span class="auth-tipo-seta cliente">›</span>
        </div>

        <div class="auth-tipo-opcao empresa" onclick="mostrarTela('tela-cadastro-empresa')">
          <div class="auth-tipo-icone empresa">🏢</div>
          <div style="flex:1">
            <div class="auth-tipo-titulo">Sou Empresa</div>
            <div class="auth-tipo-desc">Quero gerenciar agendamentos, cadastrar serviços e atender meus clientes.</div>
          </div>
          <span class="auth-tipo-seta empresa">›</span>
        </div>
      </div>

      <button class="auth-btn-link" onclick="mostrarTela('tela-login')">← Voltar para o login</button>
    </div>

    <!-- TELA CADASTRO CLIENTE -->
    <div class="auth-card wide" id="tela-cadastro-cliente" style="display:none">
      <div class="auth-logo">
        <div class="auth-logo-icon">T</div>
        <div>
          <div class="auth-logo-text">TrustBook</div>
          <div class="auth-logo-sub">confiança em serviços</div>
        </div>
      </div>

      <div class="auth-steps" id="steps-cliente"></div>

      <div class="auth-tipo-header">
        <div class="auth-tipo-header-icon cliente">👤</div>
        <div>
          <div class="auth-tipo-header-titulo">Criar conta — Cliente</div>
          <div class="auth-tipo-header-sub">Preencha seus dados pessoais</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:13px">
        <div>
          <div class="auth-label">Nome Completo <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">✏️</span>
            <input type="text" class="auth-input" id="cad-nome" placeholder="Ex: Maria Silva Santos">
          </div>
          <div class="auth-input-erro" id="cad-nome-erro" style="display:none"></div>
        </div>

        <div>
          <div class="auth-label">CPF <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🪪</span>
            <input type="text" class="auth-input" id="cad-cpf" placeholder="000.000.000-00">
          </div>
          <div class="auth-input-erro" id="cad-cpf-erro" style="display:none"></div>
        </div>

        <div>
          <div class="auth-label">E-mail <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">✉️</span>
            <input type="email" class="auth-input" id="cad-email" placeholder="seu@email.com">
          </div>
          <div class="auth-input-erro" id="cad-email-erro" style="display:none"></div>
        </div>

        <div>
          <div class="auth-label">Senha <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🔒</span>
            <input type="password" class="auth-input" id="cad-senha" placeholder="Mínimo 8 caracteres" style="padding-right:44px">
            <button type="button" class="auth-senha-toggle" onclick="toggleSenha('cad-senha',this)">👁️</button>
          </div>
          <div class="auth-input-erro" id="cad-senha-erro" style="display:none"></div>
          <div class="auth-forca" id="cad-forca"></div>
          <span class="auth-forca-label" id="cad-forca-label"></span>
        </div>

        <div>
          <div class="auth-label">Confirmar Senha <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🔒</span>
            <input type="password" class="auth-input" id="cad-confirma" placeholder="Repita a senha" style="padding-right:44px">
            <button type="button" class="auth-senha-toggle" onclick="toggleSenha('cad-confirma',this)">👁️</button>
          </div>
          <div class="auth-input-erro" id="cad-confirma-erro" style="display:none"></div>
        </div>

        <div id="cad-cliente-alert" style="display:none"></div>

        <button class="auth-btn-primary" id="cad-cliente-btn" onclick="cadastrarCliente()">
          Criar Conta →
        </button>
      </div>

      <div style="margin-top:16px">
        <button class="auth-btn-link" onclick="mostrarTela('tela-escolha')">← Voltar</button>
      </div>
    </div>

    <!-- TELA CADASTRO EMPRESA -->
    <div class="auth-card wide" id="tela-cadastro-empresa" style="display:none">
      <div class="auth-logo">
        <div class="auth-logo-icon">T</div>
        <div>
          <div class="auth-logo-text">TrustBook</div>
          <div class="auth-logo-sub">confiança em serviços</div>
        </div>
      </div>

      <div class="auth-steps" id="steps-empresa"></div>

      <div class="auth-tipo-header">
        <div class="auth-tipo-header-icon empresa">🏢</div>
        <div>
          <div class="auth-tipo-header-titulo">Criar conta — Empresa</div>
          <div class="auth-tipo-header-sub">Dados do seu estabelecimento</div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:13px">
        <div class="auth-grid-2">
          <div>
            <div class="auth-label">Razão Social <span class="auth-label-obr">*</span></div>
            <input type="text" class="auth-input" id="emp-razao" placeholder="Empresa Ltda." style="padding-left:14px">
            <div class="auth-input-erro" id="emp-razao-erro" style="display:none"></div>
          </div>
          <div>
            <div class="auth-label">Nome Fantasia <span class="auth-label-obr">*</span></div>
            <input type="text" class="auth-input" id="emp-fantasia" placeholder="Meu Negócio" style="padding-left:14px">
            <div class="auth-input-erro" id="emp-fantasia-erro" style="display:none"></div>
          </div>
        </div>

        <div>
          <div class="auth-label">CNPJ <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🪪</span>
            <input type="text" class="auth-input" id="emp-cnpj" placeholder="00.000.000/0001-00">
          </div>
          <div class="auth-input-erro" id="emp-cnpj-erro" style="display:none"></div>
        </div>

        <div>
          <div class="auth-label">E-mail <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">✉️</span>
            <input type="email" class="auth-input" id="emp-email" placeholder="empresa@email.com">
          </div>
          <div class="auth-input-erro" id="emp-email-erro" style="display:none"></div>
        </div>

        <div>
          <div class="auth-label">Senha <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🔒</span>
            <input type="password" class="auth-input" id="emp-senha" placeholder="Mínimo 8 caracteres" style="padding-right:44px">
            <button type="button" class="auth-senha-toggle" onclick="toggleSenha('emp-senha',this)">👁️</button>
          </div>
          <div class="auth-input-erro" id="emp-senha-erro" style="display:none"></div>
          <div class="auth-forca" id="emp-forca"></div>
          <span class="auth-forca-label" id="emp-forca-label"></span>
        </div>

        <div>
          <div class="auth-label">Confirmar Senha <span class="auth-label-obr">*</span></div>
          <div class="auth-input-wrap">
            <span class="auth-input-icon">🔒</span>
            <input type="password" class="auth-input" id="emp-confirma" placeholder="Repita a senha" style="padding-right:44px">
            <button type="button" class="auth-senha-toggle" onclick="toggleSenha('emp-confirma',this)">👁️</button>
          </div>
          <div class="auth-input-erro" id="emp-confirma-erro" style="display:none"></div>
        </div>

        <div id="cad-empresa-alert" style="display:none"></div>

        <button class="auth-btn-primary" id="cad-empresa-btn" onclick="cadastrarEmpresa()">
          Criar Conta →
        </button>
      </div>

      <div style="margin-top:16px">
        <button class="auth-btn-link" onclick="mostrarTela('tela-escolha')">← Voltar</button>
      </div>
    </div>

    <!-- TELA SUCESSO -->
    <div class="auth-card" id="tela-sucesso" style="display:none">
      <div class="auth-logo">
        <div class="auth-logo-icon">T</div>
        <div>
          <div class="auth-logo-text">TrustBook</div>
          <div class="auth-logo-sub">confiança em serviços</div>
        </div>
      </div>

      <div class="auth-steps" id="steps-sucesso"></div>

      <div style="text-align:center;padding:8px 0 20px">
        <div class="auth-sucesso-icon"><span>✓</span></div>
        <h2 style="font-size:1.3rem;font-weight:900;color:#22d48a;letter-spacing:-.03em;margin-bottom:8px">
          Conta criada com sucesso!
        </h2>
        <p style="font-size:.84rem;color:#8890b0;line-height:1.65;margin-bottom:22px">
          Sua conta foi criada com sucesso. Agora você pode fazer login e começar a usar o TrustBook.
        </p>

        <div class="auth-sucesso-badge">
          <span style="font-size:1.3rem" id="sucesso-icone">👤</span>
          <div style="text-align:left">
            <div class="auth-sucesso-badge-label">Tipo de acesso</div>
            <div class="auth-sucesso-badge-valor" id="sucesso-tipo">Cliente — Área do Cliente</div>
          </div>
        </div>

        <button class="auth-btn-primary" onclick="mostrarTela('tela-login')">
          Ir para o Login →
        </button>
        <p style="font-size:.75rem;color:#6b7294;margin-top:14px" id="sucesso-timer"></p>
      </div>
    </div>

  </div>
</div>

<script src="assets/js/app.js"></script>
<script>
// ─── HELPERS ─────────────────────────────────────────────
function maskCPF(v){
  return v.replace(/\D/g,"").slice(0,11)
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d{1,2})$/,"$1-$2");
}
function maskCNPJ(v){
  return v.replace(/\D/g,"").slice(0,14)
    .replace(/(\d{2})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1/$2")
    .replace(/(\d{4})(\d{1,2})$/,"$1-$2");
}
function isCPF(v){return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)}
function isCNPJ(v){return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v)}

function toggleSenha(id,btn){
  const inp=document.getElementById(id);
  if(inp.type==='password'){inp.type='text';btn.textContent='🙈'}
  else{inp.type='password';btn.textContent='👁️'}
}

function mostrarTela(id){
  document.querySelectorAll('.auth-card').forEach(c=>c.style.display='none');
  document.getElementById(id).style.display='block';
  document.getElementById(id).style.animation='fadeUp .3s cubic-bezier(.22,1,.36,1)';
}

function showAlert(elId,tipo,msg){
  const el=document.getElementById(elId);
  const icone=tipo==='erro'?'✕':tipo==='ok'?'✓':'i';
  el.innerHTML='<div class="auth-alert '+tipo+'"><span class="auth-alert-icone">'+icone+'</span><p class="auth-alert-texto">'+msg+'</p></div>';
  el.style.display='block';
}
function hideAlert(elId){document.getElementById(elId).style.display='none'}

function setErro(campo,msg){
  const el=document.getElementById(campo+'-erro');
  const inp=document.getElementById(campo);
  if(el){el.innerHTML='<span>!</span>'+msg;el.style.display='flex'}
  if(inp)inp.classList.add('erro');
}
function clearErro(campo){
  const el=document.getElementById(campo+'-erro');
  const inp=document.getElementById(campo);
  if(el)el.style.display='none';
  if(inp)inp.classList.remove('erro');
}

function renderSteps(containerId,atual){
  const etapas=['Dados','Verificação','Pronto'];
  const el=document.getElementById(containerId);
  let h='';
  etapas.forEach(function(e,i){
    const feito=i<ativo;
    const ativo2=i===ativo;
    const cls=feito?'feito':ativo2?'ativo':'pendente';
    h+='<div class="auth-step" style="flex:'+(i<2?1:'none')+'">';
    h+='  <div style="display:flex;flex-direction:column;align-items:center;gap:4px">';
    h+='    <div class="auth-step-circle '+cls+'">'+(feito?'✓':i+1)+'</div>';
    h+='    <span class="auth-step-label '+cls+'">'+e+'</span>';
    h+='  </div>';
    if(i<2)h+='<div class="auth-step-line" style="background:'+(feito?'#22d48a':'#232840')+'"></div>';
    h+='</div>';
  });
  el.innerHTML=h;
}

function barraForca(senha,inputId,labelId){
  if(!senha){document.getElementById(inputId).innerHTML='';document.getElementById(labelId).textContent='';return}
  const forca=!senha?0:senha.length<6?1:senha.length<10?2:/[A-Z]/.test(senha)&&/\d/.test(senha)?4:3;
  const rotulos=['','Muito fraca','Fraca','Boa','Forte'];
  const cores=['transparent','#ff5c7a','#ffa94d','#4f8cff','#22d48a'];
  let h='';
  for(var i=1;i<=4;i++)h+='<div class="auth-forca-bar" style="background:'+(forca>=i?cores[forca]:'#2e3550')+'"></div>';
  document.getElementById(inputId).innerHTML=h;
  document.getElementById(labelId).textContent=rotulos[forca];
  document.getElementById(labelId).style.color=cores[forca];
}

// ─── LOGIN ───────────────────────────────────────────────
document.getElementById('login-doc').addEventListener('input',function(e){
  const raw=this.value.replace(/\D/g,"");
  if(raw.length<=11)this.value=maskCPF(raw);
  else this.value=maskCNPJ(raw);
  clearErro('login-doc');

  const icon=document.getElementById('login-doc-icon');
  const badge=document.getElementById('login-tipo-badge');
  if(isCNPJ(this.value)){
    icon.textContent='🏢';
    badge.innerHTML='<div class="auth-tipo-badge empresa"><span style="font-size:.88rem">🏢</span><span class="auth-tipo-badge-texto">Entrando como Empresa</span></div>';
    badge.style.display='block';
  } else if(isCPF(this.value)){
    icon.textContent='👤';
    badge.innerHTML='<div class="auth-tipo-badge cliente"><span style="font-size:.88rem">👤</span><span class="auth-tipo-badge-texto">Entrando como Cliente</span></div>';
    badge.style.display='block';
  } else {
    icon.textContent='';
    badge.style.display='none';
  }
});

document.getElementById('login-senha').addEventListener('keydown',function(e){
  if(e.key==='Enter')fazerLogin();
  clearErro('login-senha');
});

async function fazerLogin(){
  hideAlert('login-alert');
  ['login-doc','login-senha'].forEach(clearErro);
  const doc=document.getElementById('login-doc').value;
  const senha=document.getElementById('login-senha').value;
  let ok=true;

  if(!isCPF(doc)&&!isCNPJ(doc)){setErro('login-doc','Informe um CPF válido ou CNPJ válido.');ok=false}
  if(!senha){setErro('login-senha','A senha é obrigatória.');ok=false}
  if(!ok)return;

  const btn=document.getElementById('login-btn');
  btn.disabled=true;btn.innerHTML='<svg class="auth-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Aguarde...';

  try{
    const res=await fetch('<?= defined('API_URL') ? API_URL : '' ?>/api/auth/login',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({cpf_cnpj:doc.replace(/\D/g,""),senha})
    });
    const data=await res.json();

    if(data.success){
      const tipo=data.data?.user?.tipo||(isCNPJ(doc)?'empresa':'cliente');
      localStorage.setItem('tb_'+tipo+'_token',data.data.tokens.access);
      localStorage.setItem('tb_'+tipo+'_refresh',data.data.tokens.refresh);
      localStorage.setItem('tb_tipo',tipo);
      window.location.href=tipo==='empresa'?'public/pages/home_empresa.php':'pages/explorar.php';
    } else {
      showAlert('login-alert','erro',data.message||'CPF/CNPJ ou senha incorretos.');
    }
  }catch(err){
    // Fallback: login local (demo)
    const tipo=isCNPJ(doc)?'empresa':'cliente';
    document.cookie='trustbook_tipo='+tipo+';path=/';
    <?php if(isset($_POST['email'])): ?>
    <?php endif; ?>
    showAlert('login-alert','erro','Servidor indisponível. Verifique se o Backend está rodando.');
  }

  btn.disabled=false;btn.innerHTML='Entrar →';
}

// ─── CADASTRO CLIENTE ────────────────────────────────────
document.getElementById('cad-cpf').addEventListener('input',function(){
  this.value=maskCPF(this.value);clearErro('cad-cpf');
});
document.getElementById('cad-senha').addEventListener('input',function(){
  barraForca(this.value,'cad-forca','cad-forca-label');clearErro('cad-senha');
});

async function cadastrarCliente(){
  hideAlert('cad-cliente-alert');
  ['cad-nome','cad-cpf','cad-email','cad-senha','cad-confirma'].forEach(clearErro);
  const nome=document.getElementById('cad-nome').value.trim();
  const cpf=document.getElementById('cad-cpf').value;
  const email=document.getElementById('cad-email').value.trim();
  const senha=document.getElementById('cad-senha').value;
  const confirma=document.getElementById('cad-confirma').value;
  let ok=true;

  const partes=nome.split(/\s+/);
  if(partes.length<2||partes.some(p=>p.length<2)){setErro('cad-nome','Informe nome e sobrenome completos.');ok=false}
  if(!isCPF(cpf)){setErro('cad-cpf','CPF inválido. Formato: 000.000.000-00');ok=false}
  if(!email.includes('@')||!email.includes('.')){setErro('cad-email','E-mail inválido.');ok=false}
  if(senha.length<8){setErro('cad-senha','Mínimo de 8 caracteres.');ok=false}
  if(senha!==confirma){setErro('cad-confirma','As senhas não coincidem.');ok=false}
  if(!ok)return;

  const btn=document.getElementById('cad-cliente-btn');
  btn.disabled=true;btn.innerHTML='<svg class="auth-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Aguarde...';

  try{
    const res=await fetch('<?= defined('API_URL') ? API_URL : '' ?>/api/auth/register/cliente',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({nome,cpf,email:email.toLowerCase(),senha})
    });
    const data=await res.json();
    btn.disabled=false;btn.innerHTML='Criar Conta →';
    if(data.success){
      document.getElementById('sucesso-icone').textContent='👤';
      document.getElementById('sucesso-tipo').textContent='Cliente — Área do Cliente';
      renderSteps('steps-sucesso',2);
      mostrarTela('tela-sucesso');
    } else {
      showAlert('cad-cliente-alert','erro',data.message||'Erro ao criar conta.');
    }
  }catch(err){
    btn.disabled=false;btn.innerHTML='Criar Conta →';
    // Fallback demo
    document.getElementById('sucesso-icone').textContent='👤';
    document.getElementById('sucesso-tipo').textContent='Cliente — Área do Cliente';
    renderSteps('steps-sucesso',2);
    mostrarTela('tela-sucesso');
  }
}

// ─── CADASTRO EMPRESA ────────────────────────────────────
document.getElementById('emp-cnpj').addEventListener('input',function(){
  this.value=maskCNPJ(this.value);clearErro('emp-cnpj');
});
document.getElementById('emp-senha').addEventListener('input',function(){
  barraForca(this.value,'emp-forca','emp-forca-label');clearErro('emp-senha');
});

async function cadastrarEmpresa(){
  hideAlert('cad-empresa-alert');
  ['emp-razao','emp-fantasia','emp-cnpj','emp-email','emp-senha','emp-confirma'].forEach(clearErro);
  const razao=document.getElementById('emp-razao').value.trim();
  const fantasia=document.getElementById('emp-fantasia').value.trim();
  const cnpj=document.getElementById('emp-cnpj').value;
  const email=document.getElementById('emp-email').value.trim();
  const senha=document.getElementById('emp-senha').value;
  const confirma=document.getElementById('emp-confirma').value;
  let ok=true;

  if(razao.length<3){setErro('emp-razao','Razão social obrigatória.');ok=false}
  if(fantasia.length<2){setErro('emp-fantasia','Nome fantasia obrigatório.');ok=false}
  if(!isCNPJ(cnpj)){setErro('emp-cnpj','CNPJ inválido. Formato: 00.000.000/0001-00');ok=false}
  if(!email.includes('@')){setErro('emp-email','E-mail inválido.');ok=false}
  if(senha.length<8){setErro('emp-senha','Mínimo de 8 caracteres.');ok=false}
  if(senha!==confirma){setErro('emp-confirma','As senhas não coincidem.');ok=false}
  if(!ok)return;

  const btn=document.getElementById('cad-empresa-btn');
  btn.disabled=true;btn.innerHTML='<svg class="auth-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-opacity=".2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Aguarde...';

  try{
    const res=await fetch('<?= defined('API_URL') ? API_URL : '' ?>/api/auth/register/empresa',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({razao_social:razao,nome_fantasia:fantasia,cnpj,email:email.toLowerCase(),senha})
    });
    const data=await res.json();
    btn.disabled=false;btn.innerHTML='Criar Conta →';
    if(data.success){
      document.getElementById('sucesso-icone').textContent='🏢';
      document.getElementById('sucesso-tipo').textContent='Empresa — Painel TrustBook';
      renderSteps('steps-sucesso',2);
      mostrarTela('tela-sucesso');
    } else {
      showAlert('cad-empresa-alert','erro',data.message||'Erro ao criar conta.');
    }
  }catch(err){
    btn.disabled=false;btn.innerHTML='Criar Conta →';
    document.getElementById('sucesso-icone').textContent='🏢';
    document.getElementById('sucesso-tipo').textContent='Empresa — Painel TrustBook';
    renderSteps('steps-sucesso',2);
    mostrarTela('tela-sucesso');
  }
}

// ─── INIT ────────────────────────────────────────────────
renderSteps('steps-cliente',0);
renderSteps('steps-empresa',0);

// Enter no login
document.getElementById('login-senha').addEventListener('keydown',function(e){
  if(e.key==='Enter')fazerLogin();
});
</script>

</body>
</html>
