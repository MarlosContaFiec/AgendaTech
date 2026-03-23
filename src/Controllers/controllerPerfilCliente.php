<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';
require_once __DIR__ . '/../Services/PerfilClienteService.php';
require_once __DIR__ . '/../Services/OCRService.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_tipo'] !== 'cliente') {
    header('Location: login.php');
    exit;
}

$userId = $_SESSION['user_id'];

$perfilService = new PerfilClienteService($pdo);
$dados = $perfilService->buscarCliente($userId);

if (!$dados) {
    die('Cliente não encontrado');
}

// OCR (somente cliente)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    OCRService::processarDocumento($pdo, $userId);
}

require __DIR__ . '/../pages/perfil_cliente.php';