<?php

function ocrLog(string $msg): void
{
    $linha = '[' . date('Y-m-d H:i:s') . '] ' . $msg . PHP_EOL;
    file_put_contents('C:/temp/ocr.log', $linha, FILE_APPEND);
}

class OCRService
{
    public static function processarDocumento(PDO $pdo, int $userId): void
    {
        ocrLog('INICIO do OCR');

        if (
            !isset($_FILES['documento']) ||
            $_FILES['documento']['error'] !== UPLOAD_ERR_OK
        ) {
            ocrLog('ERRO: arquivo não enviado');
            return;
        }

        $arquivo = $_FILES['documento']['tmp_name'];
        ocrLog("Arquivo tmp: $arquivo");

        if (!file_exists($arquivo)) {
            ocrLog('ERRO: arquivo tmp não existe');
            return;
        }

        // pega do .env
        $tesseract = $_ENV['TESSERACT_PATH'] ?? null;

        if (!$tesseract || !file_exists($tesseract)) {
            ocrLog("ERRO: Tesseract inválido: {$tesseract}");
            return;
        }

        // chamada direta ao tesseract
        $cmd = '"' . $tesseract . '" "' 
             . $arquivo 
             . '" stdout -l por 2>&1';

        ocrLog("CMD: $cmd");

        $texto = shell_exec($cmd);

        if ($texto === null) {
            ocrLog('ERRO: shell_exec retornou NULL');
            return;
        }

        ocrLog("OCR RETORNO:\n" . $texto);

        // regex data
if (preg_match(
    '/DATA\s+NASCIMENTO[\s\S]{0,40}?(\d{2}\/\d{2}\/\d{4})/i',
    $texto,
    $m
)) {
    $dataStr = $m[1] ?? '';

    if (!empty($dataStr)) {
        $dt = DateTime::createFromFormat('d/m/Y', $dataStr);

        if ($dt) {
            ocrLog("DATA NASCIMENTO ENCONTRADA: " . $dt->format('Y-m-d'));

            $stmt = $pdo->prepare("
                UPDATE cliente 
                SET data_nascimento = ?, verificado = 1
                WHERE id = ?
            ");
            $stmt->execute([$dt->format('Y-m-d'), $userId]);
        } else {
            ocrLog("ERRO: Data inválida detectada -> $dataStr");
        }
    } else {
        ocrLog("ERRO: Regex encontrou grupo vazio");
    }
} else {
    ocrLog('DATA DE NASCIMENTO NÃO ENCONTRADA (NASC)');
}

ocrLog('FIM do OCR');
}
}
