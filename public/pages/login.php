<?php
require __DIR__ . '/../../src/Controllers/controllerLogin.php';
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