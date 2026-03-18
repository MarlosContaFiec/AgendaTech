<?php
session_start();
include("../include/conexao.php");

require '../phpmailer/src/Psr/Log/LoggerInterface.php';
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

$erro = null;

function validarCNPJ($cnpj)
{
    $cnpj = preg_replace('/[^0-9]/', '', $cnpj);

    if (strlen($cnpj) != 14) {
        return false;
    }

    if (preg_match('/(\d)\1{13}/', $cnpj)) {
        return false;
    }

    $peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    $soma = 0;

    for ($i = 0; $i < 12; $i++) {
        $soma += $cnpj[$i] * $peso1[$i];
    }

    $resto = $soma % 11;
    $digito1 = ($resto < 2) ? 0 : 11 - $resto;

    $peso2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    $soma = 0;

    for ($i = 0; $i < 13; $i++) {
        $soma += $cnpj[$i] * $peso2[$i];
    }

    $resto = $soma % 11;
    $digito2 = ($resto < 2) ? 0 : 11 - $resto;

    return ($cnpj[12] == $digito1 && $cnpj[13] == $digito2);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $razao_social = $_POST['razao_social'] ?? null;
    $nome_fantasia = $_POST['nome_fantasia'] ?? null;
    $cnpj = preg_replace('/\D/', '', $_POST['cnpj'] ?? '');
    $email = $_POST['email'] ?? null;
    $senha_post = $_POST['senha'] ?? null;
    $confirmar_senha = $_POST['confirmar_senha'] ?? null;

    if (!validarCNPJ($cnpj)) {
        $erro = "CNPJ inválido";
    } elseif (strlen($senha_post) < 8) {
        $erro = "Sua senha deve conter no mínimo 8 caracteres.";
    } elseif (!preg_match('/[A-Z]/', $senha_post)) {
        $erro = "Sua senha deve conter uma letra MAIÚSCULA.";
    } elseif (!preg_match('/[a-z]/', $senha_post)) {
        $erro = "Sua senha deve conter uma letra MINÚSCULA.";
    } elseif (!preg_match('/[0-9]/', $senha_post)) {
        $erro = "Sua senha deve conter um número.";
    } elseif (!preg_match('/[!@#$%&*]/', $senha_post)) {
        $erro = "Sua senha deve conter um caractere especial.";
    } elseif ($confirmar_senha !== $senha_post) {
        $erro = "As senhas não coincidem.";
    }

    if ($erro === null) {

        $senha_hash = password_hash($senha_post, PASSWORD_DEFAULT);

        try {

            $sqlBusca = $pdo->prepare('SELECT * FROM empresa WHERE cnpj = ?');
            $sqlBusca->execute([$cnpj]);

            if ($sqlBusca->rowCount() == 0) {

                $codigo = rand(100000, 999999);

                $_SESSION['codigo_verificacao'] = $codigo;

                $_SESSION['empresa_temp'] = [
                    'razao_social' => $razao_social,
                    'nome_fantasia' => $nome_fantasia,
                    'cnpj' => $cnpj,
                    'email' => $email,
                    'senha' => $senha_hash
                ];

                try {

                    $mail->isSMTP();
                    $mail->Host = 'smtp.gmail.com';
                    $mail->SMTPAuth = true;
                    $mail->Username = 'contatoagendatech@gmail.com';
                    $mail->Password = 'iito hmde pktd zfpg';
                    $mail->SMTPSecure = 'tls';
                    $mail->Port = 587;

                    $mail->setFrom('contatoagendatech@gmail.com', 'AgendaTech');
                    $mail->addAddress($email);

                    $mail->isHTML(true);
                    $mail->CharSet = 'UTF-8';
                    $mail->Subject = 'Código de Verificação';

                    $mail->Body = "
                    <h2>Olá!</h2>
                    <p>Seu código de verificação é:</p>
                    <h1 style='color:#007bff;'>$codigo</h1>
                    <p>Digite esse código para ativar sua conta.</p>
                    ";

                    $mail->send();

                    header("Location: verificacao.php");
                    exit;
                } catch (Exception $e) {
                    $erro = "Erro ao enviar email.";
                }
            } else {
                $erro = "Este CNPJ já está cadastrado.";
            }
        } catch (Exception $e) {
            $erro = "Erro no banco de dados.";
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