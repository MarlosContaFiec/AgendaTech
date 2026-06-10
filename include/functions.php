<?php

require_once __DIR__ . '/../vendor/autoload.php';

use thiagoalessio\TesseractOCR\TesseractOCR;

function gerarPerfil($pdo, $user_id)
{
    // ================= 1. VERIFICAÇÃO DE POST (ADICIONADO PARA SALVAR) =================
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['p-fantasia'])) {
        salvarPerfil($pdo, $user_id);
        // Recarrega a página para mostrar os dados novos e evitar reenvio de formulário
        echo "<script>window.location.href=window.location.href;</script>";
        exit;
    }

    // ================= OCR COM TESSERACT (MANTIDO) =================
    if (
        $_SERVER['REQUEST_METHOD'] === 'POST' &&
        isset($_FILES['documento']) &&
        $_FILES['documento']['error'] === UPLOAD_ERR_OK
    ) {
        $arquivo = $_FILES['documento']['tmp_name'];
        $mime = mime_content_type($arquivo);

        if (in_array($mime, ['image/jpeg', 'image/png'])) {
            try {
                $texto = (new TesseractOCR($arquivo))
                    ->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
                    ->lang('por')
                    ->run();

                if (preg_match('/\b\d{2}\/\d{2}\/\d{4}\b/', $texto, $data)) {
                    $dt = DateTime::createFromFormat('d/m/Y', $data[0]);
                    if ($dt) {
                        $stmt = $pdo->prepare("UPDATE cliente SET data_nascimento = ?, verificado = 1 WHERE id = ?");
                        $stmt->execute([$dt->format('Y-m-d'), $user_id]);
                    }
                }
            } catch (Throwable $e) {
                error_log($e->getMessage());
            }
        }
    }

    // ================= PEGAR TIPO E DADOS (MANTIDO) =================
    $pegarTipo = $pdo->prepare('SELECT tipo FROM usuario WHERE id = ?');
    $pegarTipo->execute([$user_id]);
    $resultadoTipo = $pegarTipo->fetch(PDO::FETCH_ASSOC);

    if (!$resultadoTipo) return;

    $tipo = $resultadoTipo['tipo'];

    if ($tipo === 'empresa') {
        $stmt = $pdo->prepare("
            SELECT u.*, e.*, ep.descricao, ep.logo_url, ep.cor_primaria, ep.cor_secundaria, ep.cidade as cidade_perfil
            FROM usuario u
            JOIN empresa e ON u.id = e.id
            LEFT JOIN empresaProfile ep ON e.id = ep.empresa_id
            WHERE u.id = ?
        ");
    } else {
        $stmt = $pdo->prepare("SELECT * FROM usuario JOIN cliente ON usuario.id = cliente.id WHERE usuario.id = ?");
    }

    $stmt->execute([$user_id]);
    $dados = $stmt->fetch(PDO::FETCH_ASSOC);

    // ================= EMPRESA (SEU HTML EXATO COM OS AJUSTES DE NAME) =================
    if ($tipo == 'empresa') {
        $cor1 = $dados['cor_primaria'] ?? '#5b6cff';
        $cor2 = $dados['cor_secundaria'] ?? '#ffffff';
        $fantasia = htmlspecialchars($dados['nome_fantasia'] ?? '');
        $cidade = htmlspecialchars($dados['cidade_perfil'] ?? $dados['cep'] ?? 'Cidade não informada');

        echo "
        <form method='POST'>
        <div class='section active' id='section-perfil'>
            <div class='section-header'>
                <div>
                    <div class='section-title'>Perfil da Empresa</div>
                    <div class='section-sub'>Informações exibidas na página pública para os clientes</div>
                </div>
                <button class='btn btn-primary' type='submit'>
                    💾 Salvar alterações
                </button>
            </div>

            <div class='preview-bar' id='preview-bar' style='border-left: 4px solid $cor1'>
                <div class='preview-logo' id='preview-logo'>
                    " . ($dados['logo_url'] ? "<img src='{$dados['logo_url']}' style='width:100%; height:100%; object-fit:cover; border-radius:6px;'>" : "🏢") . "
                </div>
                <div>
                    <div class='preview-name' id='preview-nf'>$fantasia</div>
                    <div class='preview-city' id='preview-city'>$cidade</div>
                </div>

                <div class='preview-colors'>
                    <div class='preview-color-dot' id='prev-cor1' style='background:$cor1'></div>
                    <div class='preview-color-dot' id='prev-cor2' style='background:$cor2'></div>
                </div>
            </div>

            <div class='grid-2'>
                <div class='card'>
                    <div class='card-title' style='margin-bottom:18px'>Dados Cadastrais</div>
                    <div class='form-group'>
                        <label>Razão Social</label>
                        <input type='text' id='p-razao' value='" . htmlspecialchars($dados['razao_social']) . "' disabled>
                    </div>
                    <div class='form-group'>
                        <label>Nome Fantasia</label>
                        <input type='text' name='p-fantasia' id='p-fantasia' value='$fantasia' placeholder='Nome que os clientes verão'>
                    </div>
                    <div class='form-row'>
                        <div class='form-group'>
                            <label>CNPJ</label>
                            <input type='text' id='p-cnpj' value='" . htmlspecialchars(preg_replace("/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/", "$1.$2.$3/$4-$5", $dados['cnpj'])) . "' disabled>
                        </div>
                        <div class='form-group'>
                            <label>Telefone</label>
                            <input type='text' name='p-telefone' id='p-telefone' value='" . htmlspecialchars($dados['telefone'] ?? '') . "'>
                        </div>
                    </div>
                    <div class='form-row'>
                        <div class='form-group'>
                            <label>Cidade</label>
                            <input type='text' name='p-cidade' id='p-cidade' value='$cidade'>
                        </div>
                        <div class='form-group'>
                            <label>CEP</label>
                            <input type='text' name='p-cep' id='p-cep' value='" . htmlspecialchars($dados['cep'] ?? '') . "'>
                        </div>
                    </div>
                </div>

                <div class='card'>
                    <div class='card-title' style='margin-bottom:18px'>Aparência Pública</div>
                    <div class='form-group'>
                        <label>Descrição</label>
                        <textarea name='p-descricao' id='p-descricao' placeholder='Fale um pouco sobre sua empresa...'>" . htmlspecialchars($dados['descricao'] ?? '') . "</textarea>
                    </div>
                    <div class='form-group'>
                        <label>URL do Logo</label>
                        <input type='url' name='p-logo' id='p-logo' value='" . htmlspecialchars($dados['logo_url'] ?? '') . "' placeholder='https://...'>
                    </div>
                    <div class='form-row'>
                        <div class='form-group'>
                            <label>Cor Primária</label>
                            <div class='color-field'>
                                <input type='color' id='p-cor1-picker' value='$cor1' oninput=\"document.getElementById('p-cor1').value = this.value\">
                                <input type='text' name='p-cor1' id='p-cor1' value='$cor1' maxlength='7'>
                            </div>
                        </div>
                        <div class='form-group'>
                            <label>Cor Secundária</label>
                            <div class='color-field'>
                                <input type='color' id='p-cor2-picker' value='$cor2' oninput=\"document.getElementById('p-cor2').value = this.value\">
                                <input type='text' name='p-cor2' id='p-cor2' value='$cor2' maxlength='7'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </form>
        <script src='./assets/js/perfil.js'></script>";
    }
}

function salvarPerfil($pdo, $user_id) {
    // Recebe os dados do POST (Agora os inputs tem NAME correspondente)
    $novo_nome = $_POST['p-fantasia'] ?? '';
    $cidade    = $_POST['p-cidade'] ?? '';
    $cep       = $_POST['p-cep'] ?? '';
    $telefone  = $_POST['p-telefone'] ?? '';
    $descricao = $_POST['p-descricao'] ?? '';
    $logo_url  = $_POST['p-logo'] ?? '';
    $cor1      = $_POST['p-cor1'] ?? '#5b6cff';
    $cor2      = $_POST['p-cor2'] ?? '#ffffff';

    if (empty($novo_nome)) return;

    try {
        $pdo->beginTransaction();

        // 1. Atualiza a tabela 'empresa'
        $stmt = $pdo->prepare('UPDATE empresa SET nome_fantasia = ?, cep = ?, telefone = ? WHERE id = ?');
        $stmt->execute([$novo_nome, $cep, $telefone, $user_id]);

        // 2. Atualiza 'empresaProfile' (usando ON DUPLICATE KEY para garantir que salve mesmo que não exista a linha)
        $stmtProf = $pdo->prepare("
            INSERT INTO empresaProfile (empresa_id, cidade, descricao, logo_url, cor_primaria, cor_secundaria) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                cidade = VALUES(cidade), 
                descricao = VALUES(descricao), 
                logo_url = VALUES(logo_url),
                cor_primaria = VALUES(cor_primaria),
                cor_secundaria = VALUES(cor_secundaria)
        ");
        $stmtProf->execute([$user_id, $cidade, $descricao, $logo_url, $cor1, $cor2]);

        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Erro ao salvar: " . $e->getMessage());
    }
}