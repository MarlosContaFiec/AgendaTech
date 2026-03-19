<?php

session_start();

require __DIR__ . '/../../include/conexao.php';
require __DIR__ . '/../Services/CPFService.php';
require __DIR__ . '/../Services/EmailService.php';

$erro = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nome  = $_POST['nome'] ?? '';
    $cpf   = $_POST['cpf'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $conf  = $_POST['confirmar_senha'] ?? '';

    if (!CPFService::validar($cpf)) {
        $erro = 'CPF inválido';
    } elseif ($senha !== $conf) {
        $erro = 'Senhas não coincidem';
    }

    if (!$erro) {
        $stmt = $pdo->prepare("SELECT id FROM usuario WHERE email = ?");
        $stmt->execute([$email]);

        if ($stmt->rowCount()) {
            $erro = 'Email já cadastrado';
        } else {

            $codigo = random_int(100000, 999999);

            $_SESSION['codigo_verificacao'] = $codigo;
            $_SESSION['cliente_temp'] = [
                'nome' => $nome,
                'cpf' => $cpf,
                'email' => $email,
                'senha' => password_hash($senha, PASSWORD_DEFAULT)
            ];

            EmailService::enviarCodigo($email, $nome, $codigo);

            header('Location: verificacao.php');
            exit;
        }
    }
}