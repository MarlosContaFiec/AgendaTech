<?php
session_start();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>AgendaTech</title>
    <link rel="stylesheet" href="../assets/css/identificador.css">
</head>
<body>

<div class="identificador">
    <div class="title">Eu sou:</div>

    <input type="button" value="Cliente"
        onclick="window.location.href='../pages/cadastro_cliente.php'">

    <input type="button" value="Empresa"
        onclick="window.location.href='../pages/cadastro_empresa.php'">

    <p>
        Já possui Login?
        <a href="../pages/login.php">Fazer Login</a>
    </p>
</div>

</body>
</html>