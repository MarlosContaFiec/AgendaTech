<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_tipo'] !== 'cliente') {
    header('Location: login.php');
    exit;
}

$userId = $_SESSION['user_id'];

// usuário
$stmt = $pdo->prepare('SELECT nome FROM cliente WHERE id = ?');
$stmt->execute([$userId]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

// serviços
$stmt = $pdo->query("
    SELECT 
        s.id,
        s.nome,
        s.descricao,
        s.duracao_minutos,
        s.preco_base,
        ep.cidade
    FROM servico s
    JOIN empresaProfile ep ON ep.empresa_id = s.empresa_id
    WHERE s.ativo = 1
      AND ep.ativo = 1
");
$servicos = $stmt->fetchAll(PDO::FETCH_ASSOC);