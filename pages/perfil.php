<?php
session_start();

require_once("../include/conexao.php");
require_once("../include/functions.php");

if(!isset($_SESSION['user_id'])){
    echo "Usuário não logado";
    exit;
}

$user_id = $_SESSION['user_id'];

gerarPerfil($pdo, $user_id);