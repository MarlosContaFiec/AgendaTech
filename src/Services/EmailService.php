<?php

use PHPMailer\PHPMailer\PHPMailer;
require_once __DIR__ . '/../../vendor/autoload.php';

class EmailService
{
    private static function baseMailer(): PHPMailer
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
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        return $mail;
    }

    public static function enviarCodigo(
        string $email,
        string $nome,
        int $codigo
    ): void {
        $mail = self::baseMailer();

        $mail->addAddress($email, $nome);
        $mail->Subject = 'Código de verificação';

        $mail->Body = "
            <h2>Olá $nome</h2>
            <p>Seu código de verificação é:</p>
            <h1 style='color:#007bff'>$codigo</h1>
        ";
        try {
            $mail->send();
        } catch (\Exception $e) {
            throw new \Exception('Erro ao enviar email');
        }
    }

    public static function enviarBoasVindas(
        string $email,
        string $nome
    ): void {
        $mail = self::baseMailer();

        $mail->addAddress($email, $nome);
        $mail->Subject = 'Bem-vindo ao AgendaTech';

        $mail->Body = "
            <h2>Bem-vindo, $nome!</h2>
            <p>Sua conta foi criada com sucesso.</p>
        ";

        $mail->send();
    }
}