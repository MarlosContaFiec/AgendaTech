<?php

require_once '../includes/auth.php';
require_once '../includes/api.php';

$reservas = apiRequest('/reservas');

if(!$reservas){
    $reservas = [];
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>

<meta charset="UTF-8">

<title>Reservas</title>

<link rel="stylesheet" href="../assets/css/style.css">

</head>

<body>

<div class="app">

<?php include '../includes/sidebar.php'; ?>

<div class="main">

<div class="topbar">

    <h2>Minhas Reservas</h2>

</div>

<div class="content">

<?php foreach($reservas as $reserva): ?>

<div class="event-card">

    <div class="event-header">

        <div class="event-title">

            <?= htmlspecialchars(
                $reserva['servico']['titulo']
                ?? ''
            ) ?>

        </div>

    </div>

    <div class="event-body">

        <p>
            Data:
            <?= htmlspecialchars(
                $reserva['data']
                ?? ''
            ) ?>
        </p>

        <br>

        <p>
            Horário:
            <?= htmlspecialchars(
                $reserva['horario']
                ?? ''
            ) ?>
        </p>

    </div>

</div>

<?php endforeach; ?>

</div>

</div>

</div>

</body>
</html>
