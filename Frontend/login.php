<?php session_start(); if(isset($_GET['logout'])){session_destroy();header('Location:login.php');exit;} if($_SERVER['REQUEST_METHOD']==='POST'){$_SESSION['email']=$_POST['email'];$_SESSION['tipo']='cliente';header('Location:pages/explorar.php');exit;} ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustBook — Login</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="auth">
    <div class="abox">
      <div class="alogo">
        <div class="ali">T</div>
        <h1>TrustBook</h1>
        <p>Plataforma de agendamentos</p>
      </div>
      <div class="acard">
        <h2>Entrar</h2>
        <p class="asub">Acesse sua conta TrustBook</p>
        <form method="POST">
          <div class="fg"><label>E-MAIL</label><input type="email" name="email" class="fi" placeholder="seu@email.com" required></div>
          <div class="fg"><label>SENHA</label><input type="password" name="senha" class="fi" placeholder="Sua senha" required></div>
          <button type="submit" class="btn btn-p" style="width:100%;padding:12px">Entrar</button>
        </form>
        <div class="afoot">Não tem conta? <a href="cadastro.php">Cadastre-se</a></div>
      </div>
    </div>
  </div>
  <script src="assets/js/app.js"></script>
</body>
</html>
