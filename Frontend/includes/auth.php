```php
<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['token'])) {

    header('Location: /login.php');
    exit;
}

require_once __DIR__ . '/api.php';

$usuarioLogado = apiRequest('/auth/me');

if (
    !$usuarioLogado ||
    isset($usuarioLogado['error'])
) {

    session_destroy();

    header('Location: /login.php');
    exit;
}
