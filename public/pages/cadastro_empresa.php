<?php
require_once __DIR__ . '/../../src/Controllers/controllerCadastroEmpresa.php';
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - AgendaTech</title>
    <link rel="stylesheet" href="../assets/css/cadastro_empresa.css">
</head>
<body>

<div class="box-cadastro">

    <div class="logo">
        <img src="../assets/img/logo.png" alt="PcLab">
        <h3 class="title">AgendaTech</h3>
    </div>

    <form method="post" id="form-cadastro">

        <label>Razão Social:</label>
        <input type="text" name="razao_social" value="<?php echo $_POST['razao_social'] ?? '' ?>" required>

        <label>Nome Fantasia:</label>
        <input type="text" name="nome_fantasia" value="<?php echo $_POST['nome_fantasia'] ?? '' ?>" required>

        <div class="grid-inputs">
            <div>
                <label>CNPJ:</label>
                <input type="text" name="cnpj" id="cnpj" value="<?php echo $_POST['cnpj'] ?? '' ?>" required>
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" id="email" value="<?php echo $_POST['email'] ?? '' ?>" required>
            </div>
        </div>

        <label>Senha:</label>
        <div class="input-senha">
            <input type="password" name="senha" id="senha" required>
            <span onclick="toggleSenha('senha')">
                <img src="../assets/img/senha-olho.png" alt="Ver">
            </span>
        </div>

        <div class="verificador">
            <p id="char">● Mínimo 8 caracteres</p>
            <p id="upper">● Letra maiúscula</p>
            <p id="lower">● Letra minúscula</p>
            <p id="number">● Número</p>
            <p id="special">● Caractere especial</p>
        </div>

        <label>Confirmar Senha:</label>
        <div class="input-senha">
            <input type="password" name="confirmar_senha" id="confirmar_senha" required>
            <span onclick="toggleSenha('confirmar_senha')">
                <img src="../assets/img/senha-olho.png" alt="Ver">
            </span>
        </div>

        <button type="submit" id="btn-cadastro">Cadastrar Empresa</button>

    </form>

</div>

<script src="../assets/js/cadastro.js"></script>
<script>
    // Função para o olho funcionar
    function toggleSenha(id) {
        const input = document.getElementById(id);
        input.type = input.type === 'password' ? 'text' : 'password';
    }
</script>

</body>
</html>