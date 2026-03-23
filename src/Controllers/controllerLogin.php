<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../include/conexao.php';

$erro = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $usuario = preg_replace('/\D/', '', $_POST['usuario']); 
    $senha = $_POST['senha'];

    if (strlen($usuario) == 11) {

        // LOGIN CLIENTE
        $stmt = $pdo->prepare("
        SELECT u.*, c.cpf
        FROM usuario u
        JOIN cliente c ON c.id = u.id
        WHERE c.cpf = ?
        ");

        try {
        $stmt->execute([$usuario]);
    } catch (PDOException $e) {
        die("ERRO SQL: " . $e->getMessage());
    }

    } elseif (strlen($usuario) == 14) {

        // LOGIN EMPRESA
        $stmt = $pdo->prepare("
        SELECT u.*, e.cnpj
        FROM usuario u
        JOIN empresa e ON e.id = u.id
        WHERE e.cnpj = ?
        ");

        try {
            $stmt->execute([$usuario]);
        } catch (PDOException $e) {
            die("ERRO SQL: " . $e->getMessage());
        }

    } else {

        $erro = "CPF ou CNPJ inválido!";
    }

    if (empty($erro)) {
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && password_verify($senha, $user['senha_hash'])) {
            echo "<script>alert('teste');</script>";
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_tipo'] = $user['tipo'];

            // Redirecionamento
            if ($user['tipo'] == 'cliente') {

                header("Location: ../pages/page_cliente.php");

            } elseif ($user['tipo'] == 'empresa') {

                header("Location: ../pages/page_empresa.php");

            } else {

                header("Location: ../pages/page_cliente.php");
            }

            exit();

        } else {
            $erro = "Usuário ou senha inválidos!";
        }
    }
}

?>