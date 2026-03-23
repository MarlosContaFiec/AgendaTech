<?php
// if (session_status() === PHP_SESSION_NONE) {
//     session_start();
// }

// require_once __DIR__ . '/../../include/conexao.php';
// require_once __DIR__ . '/../../include/functions.php';

// if(!isset($_SESSION['user_id'])){
//     echo "Usuário não logado";
//     exit;
// }

// $user_id = $_SESSION['user_id'];

// gerarPerfil($pdo, $user_id);
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

<label>Data de Nascimento</label>
<input type="date" value="<?= htmlspecialchars($dados['data_nascimento'] ?? '') ?>" readonly>

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