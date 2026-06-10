<?php if(!isset($root)) include __DIR__.'/init.php'; ?>
<div class="app">
  <div class="sidebar-overlay"></div>
  <aside class="sidebar">
    <div class="sidebar-logo"><div class="li">T</div><span class="lt">TrustBook</span></div>
    <nav class="sidebar-nav">
      <div class="ng"><div class="nl">Menu</div>
        <a href="explorar.php" class="ni <?= $currentPage==='explorar'?'act':'' ?>"><span class="ic">🔍</span>Explorar</a>
        <a href="calendario.php" class="ni <?= $currentPage==='calendario'?'act':'' ?>"><span class="ic">📅</span>Calendário</a>
        <a href="agendamentos.php" class="ni <?= $currentPage==='agendamentos'?'act':'' ?>"><span class="ic">📋</span>Agendamentos</a>
        <a href="fila-espera.php" class="ni <?= $currentPage==='fila-espera'?'act':'' ?>"><span class="ic">⏳</span>Fila de Espera</a>
        <a href="notificacoes.php" class="ni <?= $currentPage==='notificacoes'?'act':'' ?>"><span class="ic">🔔</span>Notificações</a>
      </div>
      <div class="ng"><div class="nl">Conta</div>
        <a href="perfil.php" class="ni <?= $currentPage==='perfil'?'act':'' ?>"><span class="ic">👤</span>Meu Perfil</a>
        <a href="configuracoes.php" class="ni <?= $currentPage==='configuracoes'?'act':'' ?>"><span class="ic">⚙️</span>Configurações</a>
      </div>
    </nav>
    <div class="sidebar-user">
      <div class="ui-row">
        <div class="avatar"><?= $initial ?></div>
        <div>
          <div class="uem"><?= htmlspecialchars($userEmail) ?></div>
          <div class="utp"><?= htmlspecialchars($userType) ?></div>
        </div>
      </div>
      <a href="<?= $root ?>login.php?logout=1" class="btn btn-d btn-s" style="width:100%">Sair</a>
    </div>
  </aside>
  <div class="main">
    <header class="topbar">
      <button class="hamburger">☰</button>
      <div></div>
      <div class="topbar-r">
        <a href="notificacoes.php" class="tn">🔔</a>
        <a href="configuracoes.php" class="tn" title="Configurações">⚙️</a>
        <div class="tav"><?= $initial ?></div>
      </div>
    </header>
    <div class="content">
