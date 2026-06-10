
<?php

session_start();

require_once 'includes/auth.php';

if (!isset($_SESSION['token'])) {
    header('Location: login.php');
    exit;
}

$usuario = apiRequest('/auth/me');

$eventos = apiRequest('/servicos');

if (!$eventos) {
    $eventos = [];
}

?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <title>Painel do Cliente</title>

    <link rel="stylesheet" href="assets/css/style.css">

    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet">

</head>

<body>

<div class="app">

    <?php include 'includes/sidebar.php'; ?>

    <div class="main">

        <div class="topbar">

            <h2>
                Bem-vindo,
                <?= htmlspecialchars($usuario['nome'] ?? 'Cliente') ?>
            </h2>

            <div>
                <?= date('d/m/Y') ?>
            </div>

        </div>

        <div class="content">

            <div class="card">

                <h3 style="margin-bottom:15px;">
                    Buscar Serviços
                </h3>

                <div class="filters">

                    <input
                        id="searchInput"
                        class="input"
                        placeholder="Buscar serviço..."
                    >

                    <select id="tipoFiltro" class="input">
                        <option value="">Todos os tipos</option>
                    </select>

                </div>

            </div>

            <div
                id="eventosContainer"
                class="grid"
            >

                <?php foreach ($eventos as $evento): ?>

                    <div
                        class="event-card"
                        data-title="<?= strtolower($evento['titulo'] ?? '') ?>"
                    >

                        <div class="event-header">

                            <div style="display:flex;justify-content:space-between;align-items:center;">

                                <span class="badge badge-inscricao">
                                    Inscrição
                                </span>

                                <span style="font-size:.75rem;color:#7c819a;">
                                    <?= $evento['cidade'] ?? '' ?>
                                </span>

                            </div>

                            <div class="event-title">
                                <?= htmlspecialchars($evento['titulo'] ?? '') ?>
                            </div>

                            <div class="event-location">
                                <?= htmlspecialchars($evento['estabelecimento'] ?? '') ?>
                            </div>

                        </div>

                        <div class="event-body">

                            <p style="color:#7c819a;font-size:.82rem;line-height:1.6;">

                                <?= htmlspecialchars(substr($evento['descricao'] ?? '',0,150)) ?>

                            </p>

                        </div>

                        <div class="event-footer">

                            <button
                                class="btn-ghost detalhesBtn"
                                data-id="<?= $evento['id'] ?>"
                            >
                                Detalhes
                            </button>

                            <button
                                class="btn-primary inscreverBtn"
                                data-id="<?= $evento['id'] ?>"
                            >
                                Inscrever-se
                            </button>

                        </div>

                    </div>

                <?php endforeach; ?>

            </div>

        </div>

    </div>

</div>

<?php include 'includes/modal-detalhes.php'; ?>
<?php include 'includes/modal-confirmacao.php'; ?>
<?php include 'includes/modal-cancelamento.php'; ?>
<?php include 'includes/modal-fila.php'; ?>
<?php include 'includes/modal-reserva.php'; ?>

<script src="assets/js/modals.js"></script>

</body>
</html>
```
