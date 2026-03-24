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

<label>Documento (RG ou CNH)</label>
<input type="file" name="documento" accept="image/*">

<button type="submit">Salvar</button>

</form>
</div>

</body>
</html>