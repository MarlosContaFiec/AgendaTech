<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/api.php';

if (!isset($_SESSION['token'])) {

    header('Location: ../login.php');
    exit;
}

$response = apiRequest('/auth/me');

if (
    !$response ||
    $response['status'] >= 400
) {

    session_destroy();

    header('Location: ../login.php');
    exit;
}

$usuarioLogado =
    $response['data'];