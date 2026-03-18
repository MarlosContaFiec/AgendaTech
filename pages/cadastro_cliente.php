<?php
session_start();
include("../include/conexao.php");

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

$erro = null;

function validarCPF($cpf)
{
    $cpf = preg_replace('/[^0-9]/', '', $cpf);

    if (strlen($cpf) != 11) {
        return false;
    }

    if (preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {

        $soma = 0;

        for ($i = 0; $i < $t; $i++) {
            $soma += $cpf[$i] * (($t + 1) - $i);
        }

        $resto = ($soma * 10) % 11;

        if ($resto == 10 || $resto == 11) {
            $resto = 0;
        }

        if ($cpf[$t] != $resto) {
            return false;
        }
    }

    return true;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $nome = $_POST['nome'] ?? '';
    $cpf = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
    $email = $_POST['email'] ?? '';
    $senha_post = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    if (!validarCPF($cpf)) {
        $erro = "CPF inválido.";
    } elseif (strlen($senha_post) < 8) {
        $erro = "Senha deve ter no mínimo 8 caracteres.";
    } elseif (!preg_match('/[A-Z]/', $senha_post)) {
        $erro = "Senha precisa de uma letra maiúscula.";
    } elseif (!preg_match('/[a-z]/', $senha_post)) {
        $erro = "Senha precisa de uma letra minúscula.";
    } elseif (!preg_match('/[0-9]/', $senha_post)) {
        $erro = "Senha precisa de um número.";
    } elseif (!preg_match('/[!@#$%&*]/', $senha_post)) {
        $erro = "Senha precisa de um caractere especial.";
    } elseif ($senha_post !== $confirmar_senha) {
        $erro = "As senhas não coincidem.";
    }

    if ($erro === null) {

        try {

            $sql = $pdo->prepare("SELECT id FROM cliente WHERE cpf = ?");
            $sql->execute([$cpf]);

            if ($sql->rowCount() > 0) {

                $erro = "Este CPF já está cadastrado.";
            } else {

                $sql = $pdo->prepare("SELECT id FROM usuario WHERE email = ?");
                $sql->execute([$email]);

                if ($sql->rowCount() > 0) {

                    $erro = "Este email já está cadastrado.";
                } else {

                    $senha_hash = password_hash($senha_post, PASSWORD_DEFAULT);

                    $codigo = rand(100000, 999999);

                    $_SESSION['codigo_verificacao'] = $codigo;

                    $_SESSION['cliente_temp'] = [
                        'nome' => $nome,
                        'cpf' => $cpf,
                        'email' => $email,
                        'senha' => $senha_hash
                    ];

                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'contatoagendatech@gmail.com';
                    $mail->Password = 'iito hmde pktd zfpg';
                    $mail->SMTPSecure = 'tls';
                    $mail->Port = 587;

                    $mail->setFrom('contatoagendatech@gmail.com', 'AgendaTech');
                    $mail->addAddress($email, $nome);

                    $mail->isHTML(true);
                    $mail->CharSet = "UTF-8";
                    $mail->Subject = "Código de verificação";

                    $mail->Body = "
                    <h2>Olá $nome</h2>
                    <p>Seu código de verificação é:</p>
                    <h1>$codigo</h1>
                    <p>Digite esse código no site para confirmar seu cadastro.</p>
                    ";

                    $mail->send();

                    header("Location: verificacao.php");
                    exit;
                }
            }
        } catch (PDOException $e) {
            $erro = $e->getMessage();
        }
    }
}
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