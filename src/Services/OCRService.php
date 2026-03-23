<?php

class OCRService
{
    public static function processarDocumento(PDO $pdo, int $userId): void
    {
        if (
            !isset($_FILES['documento']) ||
            $_FILES['documento']['error'] !== UPLOAD_ERR_OK
        ) {
            return;
        }

        $arquivo = $_FILES['documento']['tmp_name'];
        $mime = mime_content_type($arquivo);

        if (!in_array($mime, ['image/jpeg', 'image/png'])) {
            return;
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
                    $stmt->execute([$dt->format('Y-m-d'), $userId]);
                }
            }
        } catch (Throwable $e) {
            error_log($e->getMessage());
        }
    }
}

?>