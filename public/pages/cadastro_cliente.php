<?php
$erro = require __DIR__ . '/../../src/Controllers/controllerCadastro.php';
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>

    <link rel="stylesheet" href="../assets/css/cadastro_cliente.css">

</head>

<body>

    <div class="box-cadastro">

        <div class="logo">
            <img src="../assets/img/logo.png" alt="AgendaTech">
            <h3 class="title">AgendaTech</h3>
        </div>

        <form method="post" id="form-cadastro">

            <label>Nome completo:</label>
            <input type="text" name="nome" autocomplete="off" required>

            <label>CPF:</label>
            <input type="text" name="cpf" id="cpf" placeholder="000.000.000-00" autocomplete="off" required>

            <label>Email:</label>
            <input type="email" name="email" placeholder="exemplo@gmail.com" autocomplete="off" required>

            <label>Senha:</label>

            <div class="input-senha">

                <input type="password" name="senha" id="senha" placeholder="Ab123456@" required>

                <span class="toggle-senha" onclick="toggleSenha('senha')">
                    <img src="../assets/img/senha-olho.png">
                </span>

            </div>

            <div class="verificador">

                <p id="char">Mínimo 8 caracteres</p>
                <p id="upper">1 letra maiúscula</p>
                <p id="lower">1 letra minúscula</p>
                <p id="number">1 número</p>
                <p id="special">1 caractere especial</p>

            </div>

            <label>Confirmar senha:</label>

            <div class="input-senha">

                <input type="password" name="confirmar_senha" id="confirmar_senha" placeholder="Ab123456@" required>

                <span class="toggle-senha" onclick="toggleSenha('confirmar_senha')">
                    <img src="../assets/img/senha-olho.png">
                </span>

            </div>

            <button type="submit" id="btn-cadastro">
                Cadastrar
            </button>

        </form>

    </div>

    <?php if ($erro): ?>

        <div class="modal-overlay" id="modalErro">

            <div class="modal-box error">

                <div class="modal-icon">✕</div>

                <h2>Ops! Algo deu errado</h2>

                <p><?php echo htmlspecialchars($erro); ?></p>

                <button class="btn-fechar" onclick="document.getElementById('modalErro').style.display='none'">
                    Tentar novamente
                </button>

            </div>

        </div>

    <?php endif; ?>

    <script src="../assets/js/cadastro.js"></script>

</body>

</html>