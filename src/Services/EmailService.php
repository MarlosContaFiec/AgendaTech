<?php

use PHPMailer\PHPMailer\PHPMailer;

class EmailService
{
    public static function enviarCodigo(string $email, string $nome, int $codigo): void
    {
        $mail = new PHPMailer(true);

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
        ";

        $mail->send();
    }
}