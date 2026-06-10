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

// PROCESSA POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Atualiza telefone
    if (isset($_POST['telefone'])) {
        $telefone = $_POST['telefone'];
        $stmt = $pdo->prepare("
            UPDATE cliente 
            SET telefone = ?
            WHERE id = ?
        ");
        $stmt->execute([$telefone, $userId]);
    }
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['foto_perfil']['tmp_name'];
        $ext = pathinfo($_FILES['foto_perfil']['name'], PATHINFO_EXTENSION);
        $novoNome = 'perfil_' . $userId . '.' . $ext;
        $destino = __DIR__ . '/../../public/uploads/perfis/' . $novoNome;

        if (!is_dir(dirname($destino))) {
            mkdir(dirname($destino), 0755, true);
        }

        if (move_uploaded_file($tmpName, $destino)) {
            $stmt = $pdo->prepare("UPDATE usuario SET foto = ? WHERE id = ?");
            $stmt->execute(['uploads/perfis/' . $novoNome, $userId]);
        }
    }
    // Processa OCR (somente se cliente ainda não verificado)
    if (!$dados['verificado'] || $dados['verificado'] != 1) {
        OCRService::processarDocumento($pdo, $userId);
    }

    // Recarrega dados para refletir atualizações
    $dados = $perfilService->buscarCliente($userId);
}
    if (!empty($_POST['redirect_home'])) {
        header('Location: ../pages/home_cliente.php');
        exit();
    }