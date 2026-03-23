<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';
require_once __DIR__ . '/../Services/EmpresaService.php';
require_once __DIR__ . '/../Services/CNPJService.php';
require_once __DIR__ . '/../Services/EmailService.php';

$empresaService = new EmpresaService($pdo);
$emailService = new EmailService();

$erro = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $cnpj = preg_replace('/\D/', '', $_POST['cnpj']);
    $senha = $_POST['senha'];
    $confirmar = $_POST['confirmar_senha'];

    if (!CNPJService::validarCNPJ($cnpj)) {
        $erro = "CNPJ inválido";
    } elseif ($empresaService->cnpjExiste($cnpj)) {
        $erro = "CNPJ já cadastrado";
    } else {
        $erro = $empresaService->validarSenha($senha, $confirmar);
    }

    if (!$erro) {
        $codigo = rand(100000, 999999);
        $_SESSION['codigo_verificacao'] = $codigo;

        EmailService::enviarCodigo($email, $nome, $codigo);

        header("Location: verificacao.php");
        exit;
    }
}