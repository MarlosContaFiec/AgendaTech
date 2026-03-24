<?php 
require_once __DIR__ . '/../../src/Controllers/controllerHomeCliente.php';
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/assets/css/page_cliente.css">
    <title>AgendaTech</title>
</head>

<body>

<header>
    <div class="logo">AgendaTech</div>

    <div class="search-bar">
        <input type="text" placeholder="Buscar serviços...">
        <div class="filters">
            <button>Categoria</button>
            <button>Cidade</button>
            <button>Extras</button>
        </div>
    </div>

    <div class="profile">
        <img src="https://i.pravatar.cc/40">
        <span><?= htmlspecialchars($usuario['nome']) ?></span>
        <a href="../pages/perfil_cliente.php">Configurações</a>
    </div>
</header>

<div class="container">

<main>
<?php
$atual = null;
foreach ($servicos as $s):
    if ($atual !== $s['nome']):
        if ($atual !== null) echo '</div></div>';
        $atual = $s['nome'];
?>
    <div class="card">
        <h3><?= $s['nome'] ?></h3>
        <p><?= $s['cidade'] ?></p>
        <div class="horarios">
<?php endif; ?>

<p>Duração: <?= $s['duracao_minutos'] ?> min</p>
<p>Preço: R$ <?= number_format($s['preco_base'], 2, ',', '.') ?></p>

<?php endforeach; ?>
</div></div>
</main>

<div class="sidebar">
    <ul>
        <li>Histórico</li>
        <li>Serviços</li>
        <li>Configurações</li>
        <li>Sair</li>
    </ul>
</div>

</div>
</body>
</html>