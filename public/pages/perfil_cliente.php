<?php
require_once __DIR__ . '/../../src/Controllers/controllerPerfilCliente.php';
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Perfil do Cliente</title>
    <link rel="stylesheet" href="../assets/css/perfil.css">
</head>

<body>

<div class="container">
<h2>Perfil do Cliente</h2>

<div class="foto-container">

    <div id="fotoPerfilWrapper">
        <?php if (!empty($dados['foto_perfil'])): ?>
            <img id="fotoPerfil" src="../<?= $dados['foto_perfil'] ?>">
        <?php else: ?>
            <span id="textoFoto">Foto</span>
        <?php endif; ?>
    </div>

    <input type="file" id="inputFoto" name="foto_perfil" accept="image/*" hidden>

    <button type="button" onclick="document.getElementById('inputFoto').click()">
        📷 Escolher foto
    </button>

</div>

<form method="POST" enctype="multipart/form-data">

<p id="msgSucesso">Alterações salvas com sucesso ✅</p>

<div class="field">
<label>Nome</label>
<input type="text" value="<?= htmlspecialchars($dados['nome']) ?>" disabled>
</div>

<div class="field">
<label>CPF</label>
<input type="text" value="<?= htmlspecialchars(preg_replace("/(\d{3})(\d{3})(\d{3})(\d{2})/", "$1.$2.$3-$4", $dados['cpf'])) ?>" disabled>
</div>

<?php if (empty($dados['verificado']) || $dados['verificado'] != 1): ?>
<div class="field">
<label>Documento (RG ou CNH)</label>

<input type="file" id="arquivo" name="documento" hidden>
<button type="button" onclick="document.getElementById('arquivo').click()">
Selecionar arquivo
</button>

<span id="nomeArquivo">Nenhum arquivo escolhido</span>
</div>
<?php endif; ?>

<div class="field">
<label>Data de Nascimento</label>
<input type="text" value="<?= htmlspecialchars($dados['data_nascimento'] ?? '') ?>" readonly>
</div>

<div class="field">
<label>Email</label>
<input type="email" value="<?= htmlspecialchars($dados['email']) ?>" disabled>
</div>

<div class="field">
<label>Telefone</label>
<input type="tel" name="telefone" value="<?= htmlspecialchars($dados['telefone']) ?>">
</div>

<button type="submit">Salvar</button>

</form>
</div>

<!-- MODAL -->
<div id="modalFoto" class="modal">
    <span id="fecharModal" class="fechar">&times;</span>
    <img id="fotoModal" class="modal-conteudo">
</div>

<script src="../assets/js/perfil.js"></script>

</body>
</html>