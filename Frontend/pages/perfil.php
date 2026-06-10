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

