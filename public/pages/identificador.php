<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgendaTech</title>
    <link rel="stylesheet" href="/assets/css/identificador.css">
</head>
<body>

    <div class="identificador">
    <div class="title">Eu sou:</div>
    <input type="button" class='btn-cliente' value="Cliente" onclick="window.location.href='../pages/cadastro_cliente.php'">
    <input type="button" class='btn-empresa' value="Empresa" onclick="window.location.href='../pages/cadastro_empresa.php'">
    
    <p>Já possui Login? <a href="../pages/login.php" class='title-login'>Fazer Login</a></p>
</div>
</body>
</html><?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_tipo'] !== 'cliente') {
    header('Location: login.php');
    exit();
}

$userId = $_SESSION['user_id'];

$stmt = $pdo->prepare('SELECT nome FROM cliente WHERE id = ?');
$stmt->execute([$userId]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$usuario) {
    session_destroy();
    header('Location: login.php');
    exit();
}