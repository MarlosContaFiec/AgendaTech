```php
<?php

require_once '../includes/auth.php';
require_once '../includes/api.php';

$servicos = apiRequest('/servicos');

if (!$servicos) {
    $servicos = [];
}

?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <title>Serviços</title>

    <link
        rel="stylesheet"
        href="../assets/css/style.css"
    >

</head>

<body>

<div class="app">

    <?php include '../includes/sidebar.php'; ?>

    <div class="main">

        <div class="topbar">

            <h2>
                Serviços Disponíveis
            </h2>

        </div>

        <div class="content">

            <div class="card">

                <div class="filters">

                    <input
                        type="text"
                        id="searchInput"
                        class="input"
                        placeholder="Buscar serviço..."
                    >

                </div>

            </div>

            <div
                class="grid"
                id="eventosContainer"
            >

                <?php foreach($servicos as $servico): ?>

                    <div
                        class="event-card"
                        data-title="<?= strtolower($servico['titulo'] ?? '') ?>"
                    >

                        <div class="event-header">

                            <div class="event-title">

                                <?= htmlspecialchars(
                                    $servico['titulo'] ?? ''
                                ) ?>

                            </div>

                            <div class="event-location">

                                <?= htmlspecialchars(
                                    $servico['estabelecimento'] ?? ''
                                ) ?>

                            </div>

                        </div>

                        <div class="event-body">

                            <p>

                                <?= htmlspecialchars(
                                    substr(
                                        $servico['descricao'] ?? '',
                                        0,
                                        150
                                    )
                                ) ?>

                            </p>

                        </div>

                        <div class="event-footer">

                            <button
                                class="btn-ghost"
                                onclick='abrirModalDetalhes(
                                    {
                                        titulo:`<?= addslashes($servico['titulo'] ?? '') ?>`,
                                        descricao:`<?= addslashes($servico['descricao'] ?? '') ?>`,
                                        estabelecimento:`<?= addslashes($servico['estabelecimento'] ?? '') ?>`,
                                        cidade:`<?= addslashes($servico['cidade'] ?? '') ?>`
                                    }
                                )'
                            >
                                Detalhes
                            </button>

                            <button
                                class="btn-primary"
                                onclick="
                                    abrirModalConfirmacao(
                                        <?= (int)$servico['id'] ?>
                                    )
                                "
                            >
                                Agendar
                            </button>

                        </div>

                    </div>

                <?php endforeach; ?>

            </div>

        </div>

    </div>

</div>

<?php include '../includes/modal-detalhes.php'; ?>
<?php include '../includes/modal-confirmacao.php'; ?>
<?php include '../includes/modal-fila.php'; ?>

<script src="../assets/js/app.js"></script>
<script src="../assets/js/modals.js"></script>

</body>
</html>
```
