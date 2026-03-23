<?php

require_once __DIR__ . '/../vendor/autoload.php';

use thiagoalessio\TesseractOCR\TesseractOCR;
function gerarPerfil($pdo, $user_id)
{

    // ================= OCR COM TESSERACT =================
    if (
        $_SERVER['REQUEST_METHOD'] === 'POST' &&
        isset($_FILES['documento']) &&
        $_FILES['documento']['error'] === UPLOAD_ERR_OK
    ) {

        $arquivo = $_FILES['documento']['tmp_name'];
        $mime = mime_content_type($arquivo);

        if (!in_array($mime, ['image/jpeg', 'image/png'])) {
            return; // ignora arquivos inválidos
        }

        try {

            $texto = (new TesseractOCR($arquivo))
                ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                ->lang('por')
                ->run();

            if (preg_match('/\b\d{2}\/\d{2}\/\d{4}\b/', $texto, $data)) {

                $dt = DateTime::createFromFormat('d/m/Y', $data[0]);

                if ($dt) {
                    $stmt = $pdo->prepare("
                        UPDATE cliente 
                        SET data_nascimento = ?, verificado = 1
                        WHERE id = ?
                    ");
                    $stmt->execute([$dt->format('Y-m-d'), $user_id]);
                }
            }

        } catch (Throwable $e) {
            error_log($e->getMessage());
        }
    }


    // ================= PEGAR TIPO =================
    $pegarTipo = $pdo->prepare('SELECT tipo FROM usuario WHERE id = ?');
    $pegarTipo->execute([$user_id]);
    $resultadoTipo = $pegarTipo->fetch(PDO::FETCH_ASSOC);

    if (!$resultadoTipo) {
        echo "Usuário não encontrado.";
        return;
    }

    $tipo = $resultadoTipo['tipo'];

    // Segurança
    $tiposPermitidos = ['cliente', 'empresa'];
    if (!in_array($tipo, $tiposPermitidos)) {
        die("Tipo inválido");
    }

    // ================= BUSCAR DADOS =================
    $tabela = ($tipo === 'cliente') ? 'cliente' : 'empresa';
    $stmt = $pdo->prepare("
        SELECT * 
        FROM usuario 
        JOIN $tabela 
        ON usuario.id = $tabela.id
        WHERE usuario.id = ?
    ");

    $stmt->execute([$user_id]);
    $dados = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$dados) {
        echo "Dados não encontrados.";
        return;
    }

    // ================= CLIENTE =================
    if ($tipo == 'cliente') {

        echo "<!DOCTYPE html>
<html lang='pt-br'>
<head>
<meta charset='UTF-8'>
<title>Perfil do Cliente</title>
<link rel='stylesheet' href='../assets/css/perfil.css'>
</head>

<body>

<div class='container'>
<h2>Perfil do Cliente</h2>

<form method='POST' enctype='multipart/form-data'>

<div class='section profile-photo'>

<img id='fotoPerfil' src='https://via.placeholder.com/80'>

<div>
<label>Foto de Perfil</label>
<input type='file' id='inputFoto' accept='image/*'>
</div>

</div>

<div class='section'>

<h3>Informações Pessoais</h3>

<label>Nome</label>
<input type='text' value='" . htmlspecialchars($dados['nome']) . "' disabled>

<label>Data de Nascimento</label>
<input type='date' value='" . htmlspecialchars($dados['data_nascimento'] ?? '') . "' readonly>

<label>CPF</label>
<input type='text' value='" . htmlspecialchars($dados['cpf']) . "' disabled>

<label>Documento (RG ou CNH)</label>
<input type='file' name='documento' accept='image/*'>

<label>Email</label>
<input type='email' value='" . htmlspecialchars($dados['email']) . "' disabled>

<label>Telefone</label>
<input type='tel' name='telefone' value='" . htmlspecialchars($dados['telefone']) . "'>

</div>

<button type='submit'>Salvar Alterações</button>
<button type='submit'>Excluir Conta</button>

</form>

</div>

<script src='./assets/js/perfil.js'></script>

</body>
</html>";
    }

    // ================= EMPRESA =================
    else if ($tipo == 'empresa') {

        echo "<!DOCTYPE html>
<html lang='pt-br'>
<head>
<meta charset='UTF-8'>
<title>Perfil da Empresa</title>
<link rel='stylesheet' href='../assets/css/perfil.css'>
</head>

<body>

<div class='container'>
<h2>Perfil da Empresa</h2>

<form method='POST'>

<label>Razão Social</label>
<input type='text' value='" . htmlspecialchars($dados['razao_social']) . "' disabled>

<label>Nome Fantasia</label>
<input type='text' name='nome_fantasia' value='" . htmlspecialchars($dados['nome_fantasia']) . "'>

<label>CNPJ</label>
<input type='text' value='" . htmlspecialchars($dados['cnpj']) . "' disabled>

<label>Email</label>
<input type='email' value='" . htmlspecialchars($dados['email']) . "' disabled>

<label>Telefone</label>
<input type='tel' name='telefone' value='" . htmlspecialchars($dados['telefone']) . "'>

<label>CEP</label>
<input type='text' name='cep' value='" . htmlspecialchars($dados['cep']) . "'>

<button type='submit'>Salvar Alterações</button>
<button type='submit'>Excluir Conta</button>

</form>

</div>

<script src='./assets/js/perfil.js'></script>

</body>
</html>";
    }
}