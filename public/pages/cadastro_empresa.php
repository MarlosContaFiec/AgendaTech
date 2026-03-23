<?php
require_once __DIR__ . '/../../src/Controllers/controllerCadastroEmpresa.php';
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="stylesheet" href="../assets/css/cadastro_empresa.css">
</head>

<body>

    <body>

        <div class="box-cadastro">

            <div class="logo">
                <img src="../assets/img/logo.png" alt="PcLab">
                <h3 class="title">AgendaTech</h3>
            </div>

            <form method="post" id="form-cadastro">

                <label for="razao_social">Razão Social:</label>
                <input type="text" name="razao_social" id="razao_social" autocomplete="off" required>

                <label for="nome_fantasia">Nome Fantasia:</label>
                <input type="text" name="nome_fantasia" id="nome_fantasia"autocomplete="off" required>

                <label for="cnpj">CNPJ:</label>
                <input type="text" name="cnpj" id="cnpj" placeholder="00.000.000/0001-0" autocomplete="off" required>

                <label for="email">Email:</label>
                <input type="email" name="email" id="email" placeholder="exemplo@gmail.com" autocomplete="off" required>

                <label for="senha">Senha:</label>
                <div class="input-senha">
                    <input type="password" name="senha" id="senha" placeholder="Ab123456@"required>
                    <span class="toggle-senha" onclick="toggleSenha('senha')">
                        <img src="../assets/img/senha-olho.png" alt="Mostrar senha">
                    </span>
                </div>

                <div class="verificador">
                    <p class="check-numero">Mínimo 8 CARACTÉRES</p>
                    <p class="check-maiusculo">Mínimo 1 letra MAIÚSCULA</p>
                    <p class="check-minusculo">Mínimo 1 letra MINÚSCULA</p>
                    <p class="check-caractere">Mínimo 1 caractere especial</p>
                </div>

                <label for="confirmar_senha">Confirmar senha:</label>
                <div class="input-senha">
                    <input type="password" name="confirmar_senha" id="confirmar_senha" placeholder="Ab123456@" required>
                    <span class="toggle-confirmar_senha" onclick="toggleSenha('confirmar_senha')">
                        <img src="../assets/img/senha-olho.png" alt="Mostrar senha">
                    </span>
                </div>

                <button type="submit" id="btn-cadastro">Cadastrar</button>

            </form>

        </div>

        <?php if (isset($erro)): ?>
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