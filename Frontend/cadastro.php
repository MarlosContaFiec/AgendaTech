<?php session_start(); ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustBook — Cadastro</title>
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
        <h2>Criar conta</h2>
        <p class="asub">Cadastre-se no TrustBook</p>
        <form method="POST" action="login.php">
          <div class="fg"><label>NOME</label><input type="text" name="nome" class="fi" placeholder="Seu nome" required></div>
          <div class="fg"><label>E-MAIL</label><input type="email" name="email" class="fi" placeholder="seu@email.com" required></div>
          <div class="fg"><label>SENHA</label><input type="password" name="senha" class="fi" placeholder="Crie uma senha" required></div>
          <button type="submit" class="btn btn-p" style="width:100%;padding:12px">Criar conta</button>
        </form>
        <div class="afoot">Já tem conta? <a href="login.php">Entrar</a></div>
      </div>
    </div>
  </div>
  <script src="assets/js/app.js"></script>
</body>
</html>
