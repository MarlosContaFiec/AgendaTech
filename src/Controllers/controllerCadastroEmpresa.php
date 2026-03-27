<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';
require_once __DIR__ . '/../Services/EmpresaService.php';
require_once __DIR__ . '/../Services/CNPJService.php';
require_once __DIR__ . '/../Services/EmailService.php';

$empresaService = new EmpresaService($pdo);

$erro = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $razao_social  = $_POST['razao_social'] ?? '';
    $nome_fantasia = $_POST['nome_fantasia'] ?? '';
    $email         = $_POST['email'] ?? '';
    $cnpj          = preg_replace('/\D/', '', $_POST['cnpj'] ?? '');
    $senha         = $_POST['senha'] ?? '';
    $confirmar     = $_POST['confirmar_senha'] ?? '';

    if (!CNPJService::validarCNPJ($cnpj)) {
        $erro = "CNPJ inválido";
    } elseif ($empresaService->cnpjExiste($cnpj)) {
        $erro = "CNPJ já cadastrado";
    } else {
        $erro = $empresaService->validarSenha($senha, $confirmar);
    }

    if (!$erro) {

        $codigo = random_int(100000, 999999);

        $_SESSION['codigo_verificacao'] = $codigo;

        $_SESSION['empresa_temp'] = [
            'razao_social' => $razao_social,
            'nome_fantasia' => $nome_fantasia,
            'cnpj' => $cnpj,
            'email' => $email,
            'senha' => password_hash($senha, PASSWORD_DEFAULT)
        ];

        $_SESSION['email'] = $email;

        EmailService::enviarCodigo($email, $nome_fantasia, $codigo);

        header("Location: verificacao.php");
        exit;
    }
}