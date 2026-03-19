<?php
session_start();

require __DIR__ . '/../../include/conexao.php';

$erro = null;
$sucesso = false;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $codigo = $_POST['codigo'] ?? '';

    if (!isset($_SESSION['codigo_verificacao'])) {
        $erro = "Sessão expirada. Cadastre novamente.";
    } elseif ($codigo != $_SESSION['codigo_verificacao']) {
        $erro = "Código inválido.";
    } else {

        // CADASTRO DE CLIENTE
        if (isset($_SESSION['cliente_temp'])) {

            $dados = $_SESSION['cliente_temp'];
            $data = date("Y-m-d");

            try {

                $sql = $pdo->prepare('INSERT INTO usuario (email, senha_hash, tipo, data_criacao) VALUES (?,?,?,?)');

                $sql->execute([
                    $dados['email'],
                    $dados['senha'],
                    'cliente',
                    $data
                ]);

                $id_usuario = $pdo->lastInsertId();

                $sql = $pdo->prepare('INSERT INTO cliente (id, nome, cpf) VALUES (?,?,?)');

                $sql->execute([
                    $id_usuario,
                    $dados['nome'],
                    $dados['cpf'],

                ]);



                $sucesso = true;

                unset($_SESSION['cliente_temp']);
                unset($_SESSION['codigo_verificacao']);

            } catch (PDOException $e) {

                $erro = $e->getMessage();
            }
        }

        // CADASTRO DE EMPRESA
        elseif (isset($_SESSION['empresa_temp'])) {

            $dados = $_SESSION['empresa_temp'];

            try {

                $sql = $pdo->prepare('INSERT INTO usuario (email, senha_hash, tipo) VALUES (?,?,?)');

                $sql->execute([
                    $dados['email'],
                    $dados['senha'],
                    'empresa'
                ]);

                $id_usuario = $pdo->lastInsertId();

                $sql = $pdo->prepare('INSERT INTO empresa (id, razao_social,nome_fantasia, cnpj) VALUES (?,?,?)');

                $sql->execute([
                    $id_usuario,
                    $dados['razao_social'],
                    $dados['nome_fantasia'],
                    $dados['cnpj']
                ]);


                $sucesso = true;

                unset($_SESSION['empresa_temp']);
                unset($_SESSION['codigo_verificacao']);

            } catch (PDOException $e) {

                $erro = $e->getMessage();
            }

        } else {

            $erro = "Dados de cadastro não encontrados.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Verificação de Código</title>

<link rel="stylesheet" href="../assets/css/verificacao.css">

</head>

<body>

<?php if ($sucesso): ?>

<div class="box-verificacao">

    <div class="verificacao-card">

        <div style="font-size:55px;color:#22c55e;margin-bottom:10px;">
            ✓
        </div>

        <h2>Cadastro Ativado!</h2>

        <p class="info-text">
            Seu cadastro foi confirmado com sucesso.
        </p>

        <button onclick="window.location.href='login.php'">
            Ir para Login
        </button>

    </div>

</div>

<?php else: ?>

<div class="box-verificacao">

    <div class="verificacao-card">

        <h2>Verificação de Email</h2>

        <div class="email-bar">
            <?php echo $_SESSION['email'] ?? 'Email enviado'; ?>
        </div>

        <p class="info-text">
            Digite o código que enviamos para seu email:
        </p>

        <?php if ($erro): ?>

            <div class="erro-msg">
                <?php echo htmlspecialchars($erro); ?>
            </div>

        <?php endif; ?>

        <form method="post" autocomplete="off">

            <input
                type="text"
                name="codigo"
                maxlength="6"
                required
                pattern="\d{6}"
                placeholder="Digite o código"
                title="Digite os 6 números do código">

            <button type="submit">
                Verificar Código
            </button>

        </form>

    </div>

</div>

<?php endif; ?>

</body>
</html>