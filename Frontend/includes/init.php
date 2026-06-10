<?php
@session_start();

$currentPage = basename($_SERVER['PHP_SELF'], '.php');
$userEmail = $_SESSION['email'] ?? 'user@email.com';
$userType = $_SESSION['tipo'] ?? 'cliente';
$initial = strtoupper(substr($userEmail, 0, 1));
$inPages = (basename(dirname($_SERVER['PHP_SELF'])) === 'pages');
$root = $inPages ? '../' : '';
?>
