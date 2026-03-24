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

<label>Foto de Perfil</label>
<?php if (!empty($dados['foto_perfil'])): ?>
    <img src="../<?= $dados['foto_perfil'] ?>" alt="Foto de Perfil" style="width:100px; height:100px; border-radius:50%;">
<?php endif; ?>
<input type="file" name="foto_perfil" accept="image/*">

<form method="POST" enctype="multipart/form-data">

<label>Nome</label>
<input type="text" value="<?= htmlspecialchars($dados['nome']) ?>" disabled>

<label>CPF</label>
<input type="text" value="<?= htmlspecialchars($dados['cpf']) ?>" disabled>

<label>Data de Nascimento</label><br>
<input type="date" value="<?= htmlspecialchars($dados['data_nascimento'] ?? '') ?>" readonly><br>

<label>Email</label>
<input type="email" value="<?= htmlspecialchars($dados['email']) ?>" disabled>

<label>Telefone</label>
<input type="tel" name="telefone" value="<?= htmlspecialchars($dados['telefone']) ?>">

<?php if (empty($dados['verificado']) || $dados['verificado'] != 1): ?>
    <label>Documento (RG ou CNH)</label>
    <input type="file" name="documento" accept="image/*">
<?php endif; ?>

<button type="submit" name="redirect_home" value="1">Salvar</button>

</form>
</div>

</body>
</html>