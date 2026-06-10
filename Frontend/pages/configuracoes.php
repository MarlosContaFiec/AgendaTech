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
