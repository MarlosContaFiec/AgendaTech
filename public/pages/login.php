<?php
session_start();
require_once("../include/conexao.php");

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

        $stmt->execute([$usuario]);

    } elseif (strlen($usuario) == 14) {

        // LOGIN EMPRESA
        $stmt = $pdo->prepare("
        SELECT u.*, e.cnpj
        FROM usuario u
        JOIN empresa e ON e.id = u.id
        WHERE e.cnpj = ?
        ");

        $stmt->execute([$usuario]);

    } else {

        $erro = "CPF ou CNPJ inválido!";
    }

    if (empty($erro)) {

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($senha, $user['senha_hash'])) {

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

<!DOCTYPE html>
<html lang="pt-br">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Login - AgendaTech</title>

<link rel="stylesheet" href="../assets/css/login.css"> 

</head>

<body>

<div class="box">

    <div class="logo">
        <img src="../assets/img/logo.png" alt="AgendaTech">
    </div>

    <?php if ($erro): ?>

        <div style="color:#ff4d4d;text-align:center;margin-bottom:15px;font-weight:bold;">
            <?php echo $erro; ?>
        </div>

    <?php endif; ?>

    <form method="post">

        <label>CPF ou CNPJ:</label>

        <input 
        type="text" 
        name="usuario" 
        autocomplete="off"
        required>

        <label>Senha:</label>

        <input 
        type="password" 
        name="senha" 
        required>

        <button type="submit" id='btn-login'>
            Entrar
        </button>

    </form>

    <p>
        Não tem uma conta?
        <a href="../pages/identificador.php">Criar conta</a>
    </p>

</div>

</body>
</html>